import React, { useState, useContext } from "react";
import { Context } from "../../main";
import { observer } from "mobx-react-lite";
import styles from "./LoginForm.module.css";

const LoginForm = observer(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [activeBtn, setActiveBtn] = useState("login");
  const { authStore } = useContext(Context);

  const isLogin = activeBtn === "login";

  const handleSubmit = () => {
    if (isLogin) {
      authStore.login(email, password);
    } else {
      authStore.registration(email, password, username, name, surname);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.banner}></div>

      <div className={styles.formSide}>
        <div className={styles.formInner}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className={styles.formSubtitle}>
              {isLogin
                ? "Sign in to continue your conversation"
                : "Sign up to start your AI conversation"}
            </p>
          </div>

          <div className={styles.toggle}>
            <div
              className={`${styles.slider} ${!isLogin ? styles.sliderRight : ""}`}
            />
            {["login", "register"].map((btn) => (
              <button
                key={btn}
                className={`${styles.toggleBtn} ${activeBtn === btn ? styles.toggleBtnActive : ""}`}
                onClick={() => setActiveBtn(btn)}
              >
                {btn === "login" ? "Log in" : "Register"}
              </button>
            ))}
          </div>

          <div className={styles.inputGroup}>
            {!isLogin && (
              <div className={styles.nameRow}>
                <div className={styles.inputWrap}>
                  <label className={styles.inputLabel}>First name</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Ivan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.inputWrap}>
                  <label className={styles.inputLabel}>Last name</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Petrov"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className={styles.inputWrap}>
                <label className={styles.inputLabel}>Username</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ivanpetrov"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className={styles.inputWrap}>
              <label className={styles.inputLabel}>Email</label>
              <input
                className={styles.input}
                type="email"
                placeholder="ivan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputWrap}>
              <label className={styles.inputLabel}>Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>

          <button className={styles.submitBtn} onClick={handleSubmit}>
            {isLogin ? "Log in" : "Create account"}
          </button>
        </div>
      </div>
    </div>
  );
});

export default LoginForm;
