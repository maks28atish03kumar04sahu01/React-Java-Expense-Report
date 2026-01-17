import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';
import { userService } from '../../services/Services';
import useStore from '../../store/useStore';
import { PublicRoute } from '../../Middleware';
import '../../styles/Signin.css';

const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    useremail: '',
    userpassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.useremail || !formData.userpassword) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.useremail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    setLoading(true);

    try {
      const response = await userService.signin(formData);
      if (response) {
        const user = useStore.getState().user;
        navigate(`/expense/frontend/api/v1/${user.id}/${user.username}/expense`);
      }
    } catch (error) {
      // Error is already handled in Services.jsx with toast
      console.error('Signin error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <>
        <Header />
        <div className="signin-page">
          <div className="signin-container">
            <div className="signin-card">
              <h2>Welcome Back</h2>
              <p className="signin-subtitle">Sign in to continue tracking your expenses</p>

              <form onSubmit={handleSubmit} className="signin-form">
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
                      placeholder="Enter your password"
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

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? <ClipLoader size={20} color="#fff" /> : 'Sign In'}
                </button>
              </form>

              <p className="signin-footer">
                Don't have an account?{' '}
                <a href="/expense/frontend/api/v1/signup">Sign Up</a>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    </PublicRoute>
  );
};

export default Signin;
