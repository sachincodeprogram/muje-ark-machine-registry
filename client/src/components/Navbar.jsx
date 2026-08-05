import { NavLink } from 'react-router-dom';
import arkLogo from '../assets/ark-logo.png';

function navLinkClass({ isActive }) {
  return `navbar__link${isActive ? ' navbar__link--active' : ''}`;
}

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" end className="navbar__brand">
          <img src={arkLogo} alt="ARK Group" className="navbar__mark" />
          <span className="navbar__brand-text">
            ARK Machine Registry
            <span className="navbar__brand-subtext">Sales Department</span>
          </span>
        </NavLink>

        <nav className="navbar__links" aria-label="Primary">
          <NavLink to="/" end className={navLinkClass}>
            Register Sale
          </NavLink>
          <NavLink to="/search" className={navLinkClass}>
            Search Machine
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
