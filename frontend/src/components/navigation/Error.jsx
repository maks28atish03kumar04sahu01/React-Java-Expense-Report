import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/Error.css';

const Error = () => {
  return (
    <div className="error-page">
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/expense/frontend/api/v1/home" className="error-link">
          <FaHome /> Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
