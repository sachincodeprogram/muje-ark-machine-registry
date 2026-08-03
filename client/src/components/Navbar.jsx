import { NavLink } from 'react-router-dom';

function navLinkClass({ isActive }) {
  return `navbar__link${isActive ? ' navbar__link--active' : ''}`;
}

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" end className="navbar__brand">
          <span className="navbar__mark" aria-hidden="true">
            ARK
          </span>
          <span className="navbar__brand-text">Machine Registry</span>
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
