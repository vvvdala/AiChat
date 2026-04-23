import { useContext, useEffect, useState } from "react";
import InputMessage from "../../components/InputMessage/InputMessage";
import Layout from "../../components/layout/Layout/Layout";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import styles from "./MainPage.module.css";

const MainPage = observer(() => {
  const { chatStore } = useContext(Context);
  const [request, setRequest] = useState("");

  useEffect(() => {
    chatStore.setChatId(null);
  }, []);

  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.hero}>
          <h2 className={styles.title}>Where should we begin?</h2>

          <p className={styles.subtitle}>
            Start a new conversation or pick a chat from the sidebar
          </p>
        </div>

        <div className={styles.inputArea}>
          <InputMessage
            value={request}
            setValue={setRequest}
            isNewChat={true}
          />
        </div>
      </div>
    </Layout>
  );
});

export default MainPage;
