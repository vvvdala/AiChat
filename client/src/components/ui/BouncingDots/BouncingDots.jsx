import styles from "./BouncingDots.module.css";

const BouncingDotsLoader = ({ size = 8 }) => {
  return (
    <div
      className={styles.bouncingLoader}
      style={{ "--dot-size": `${size}px` }}
    >
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default BouncingDotsLoader;
