import { NavLink } from "react-router-dom";

import styles from "./PageNav.module.css";

export default function PageNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/product">Product</NavLink>
      <NavLink to="/pricing">Pricing</NavLink>
    </nav>
  );
}
