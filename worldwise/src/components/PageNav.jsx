import { NavLink } from "react-router-dom";

import styles from "./PageNav.module.css";

import Logo from "./Logo.jsx";

export default function PageNav() {
  return (
    <>
      <nav className={styles.nav}>
        <Logo />
        <ul>
          <li>
            <NavLink to="/product">Product</NavLink>
          </li>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/login" className="cta">
              Login
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
