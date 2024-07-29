import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";

export default function AppNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to={"/"}>HI</NavLink>
      <NavLink to={"/"}>bye</NavLink>
    </nav>
  );
}
