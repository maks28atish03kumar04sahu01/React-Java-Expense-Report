import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaImage, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';
import { userService } from '../../services/Services';
import useStore from '../../store/useStore';
import { ProtectedRoute } from '../../Middleware';
import '../../styles/Profile.css';

const Profile = () => {
  const { userid } = useParams();
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    useremail: user?.useremail || '',
    userpassword: '',
    userprofileImage: user?.userprofileImage || '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile(userid);
        setProfileData({
          username: data.username || '',
          useremail: data.useremail || '',
          userpassword: '',
          userprofileImage: data.userprofileImage || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (userid) {
      fetchProfile();
    }
  }, [userid]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {};
      if (profileData.username) updateData.username = profileData.username;
      if (profileData.useremail) updateData.useremail = profileData.useremail;
      if (profileData.userpassword) updateData.userpassword = profileData.userpassword;
      if (profileData.userprofileImage) updateData.userprofileImage = profileData.userprofileImage;

      await userService.updateProfile(userid, updateData);
      setProfileData({ ...profileData, userpassword: '' });
    } catch (error) {
      console.error('Update profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <>
        <Header />
        <div className="profile-page">
          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {profileData.userprofileImage ? (
                    <img src={profileData.userprofileImage} alt="Profile" />
                  ) : (
                    <FaUser className="avatar-icon" />
                  )}
                </div>
                <h2>Profile Settings</h2>
                <p>Update your profile information</p>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>
                    <FaUser className="input-icon" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaEnvelope className="input-icon" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="useremail"
                    value={profileData.useremail}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaLock className="input-icon" />
                    New Password (Optional)
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="userpassword"
                      value={profileData.userpassword}
                      onChange={handleChange}
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <FaImage className="input-icon" />
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    name="userprofileImage"
                    value={profileData.userprofileImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <ClipLoader size={16} color="#fff" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </>
    </ProtectedRoute>
  );
};

export default Profile;
