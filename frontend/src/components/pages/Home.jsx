import { Link } from 'react-router-dom';
import { FaArrowRight, FaChartLine, FaWallet, FaUserPlus } from 'react-icons/fa';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';
import '../../styles/Home.css';

const Home = () => {
  return (
    <>
      <Header />
      <div className="home-page">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <FaChartLine className="hero-icon" />
              Expense Tracker
            </h1>
            <p className="hero-subtitle">
              Manage your expenses efficiently and take control of your finances
            </p>
            <div className="hero-buttons">
              <Link to="/expense/frontend/api/v1/signup" className="btn btn-primary">
                <FaUserPlus /> Get Started
              </Link>
              <Link to="/expense/frontend/api/v1/signin" className="btn btn-secondary">
                Sign In <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-container">
            <h2>Why Choose Expense Tracker?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <FaWallet className="feature-icon" />
                <h3>Easy Expense Management</h3>
                <p>Add, edit, and delete expenses with ease. Keep track of all your spending in one place.</p>
              </div>
              <div className="feature-card">
                <FaChartLine className="feature-icon" />
                <h3>Visual Analytics</h3>
                <p>View your expenses through beautiful charts and graphs. Understand your spending patterns.</p>
              </div>
              <div className="feature-card">
                <FaUserPlus className="feature-icon" />
                <h3>Secure & Private</h3>
                <p>Your data is secure with encrypted authentication. Your expenses are private and protected.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
