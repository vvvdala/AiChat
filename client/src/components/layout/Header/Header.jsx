import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <p onClick={() => navigate("")}>Profile</p>
    </header>
  );
};

export default Header;
