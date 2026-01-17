import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';
import { userService } from '../../services/Services';
import useStore from '../../store/useStore';
import { PublicRoute } from '../../Middleware';
import '../../styles/Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    useremail: '',
    userpassword: '',
    userprofileImage: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.username || !formData.useremail || !formData.userpassword) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    // Username validation
    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters long.');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.useremail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    // Password validation
    if (formData.userpassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);

    try {
      const response = await userService.signup(formData);
      if (response) {
        const user = useStore.getState().user;
        navigate(`/expense/frontend/api/v1/${user.id}/${user.username}/expense`);
      }
    } catch (error) {
      // Error is already handled in Services.jsx with toast
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <>
        <Header />
        <div className="signup-page">
          <div className="signup-container">
            <div className="signup-card">
              <h2>Create Account</h2>
              <p className="signup-subtitle">Sign up to start tracking your expenses</p>

              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label>
                    <FaUser className="input-icon" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
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
                    value={formData.useremail}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaLock className="input-icon" />
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="userpassword"
                      value={formData.userpassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="Enter your password (min 6 characters)"
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
                    Profile Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="userprofileImage"
                    value={formData.userprofileImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? <ClipLoader size={20} color="#fff" /> : 'Sign Up'}
                </button>
              </form>

              <p className="signup-footer">
                Already have an account?{' '}
                <a href="/expense/frontend/api/v1/signin">Sign In</a>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    </PublicRoute>
  );
};

export default Signup;
