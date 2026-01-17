import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        <p>Track your expenses efficiently and manage your finances.</p>
      </div>
    </footer>
  );
};

export default Footer;
