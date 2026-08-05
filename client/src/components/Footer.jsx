import arkLogo from '../assets/ark-logo.png';

function Footer() {
  return (
    <footer className="footer">
      <img src={arkLogo} alt="ARK Group" className="footer__mark" />
      <p>&copy; {new Date().getFullYear()} ARK Group — Machine Registry. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
