import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaHome, FaChartLine } from 'react-icons/fa';
import useStore from '../../store/useStore';
import { userService } from '../../services/Services';
import '../../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  const handleSignout = async () => {
    try {
      if (user && user.id) {
        await userService.signout(user.id);
      } else {
        // If user data is missing, just logout locally
        useStore.getState().logout();
      }
      navigate('/expense/frontend/api/v1/home');
    } catch (error) {
      console.error('Signout error:', error);
      // Even if API call fails, logout locally to ensure user is signed out
      useStore.getState().logout();
      navigate('/expense/frontend/api/v1/home');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/expense/frontend/api/v1/home" className="logo">
          <FaChartLine className="logo-icon" />
          <span>Expense Tracker</span>
        </Link>

        <nav className="nav">
          {isAuthenticated ? (
            <>
              <Link
                to={`/expense/frontend/api/v1/${user.id}/${user.username}/expense`}
                className="nav-link"
              >
                <FaHome /> Home
              </Link>
              <Link
                to={`/expense/frontend/api/v1/${user.id}/${user.username}/profile`}
                className="nav-link"
              >
                <FaUser /> Profile
              </Link>
              <button onClick={handleSignout} className="nav-link signout-btn">
                <FaSignOutAlt /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/expense/frontend/api/v1/home" className="nav-link">
                Home
              </Link>
              <Link to="/expense/frontend/api/v1/signin" className="nav-link">
                Sign In
              </Link>
              <Link to="/expense/frontend/api/v1/signup" className="nav-link signup-link">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
