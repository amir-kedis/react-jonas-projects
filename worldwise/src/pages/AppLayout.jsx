import styles from "./AppLayout.module.css";

import Map from "../components/Map";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
    </div>
  );
}
