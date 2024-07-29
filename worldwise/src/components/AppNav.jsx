import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";

export default function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to={"/app/cities"}>cities</NavLink>
        </li>
        <li>
          <NavLink to={"/app/countries"}>countries</NavLink>
        </li>
      </ul>
    </nav>
  );
}
