import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import { useContext } from "react";
import styles from "./InputMessage.module.css";

const InputMessage = observer(({ handleEvent, value, setValue, isNewChat }) => {
  const navigate = useNavigate();
  const { chatStore } = useContext(Context);

  const handleCreateChat = async () => {
    if (!value?.trim()) return;
    const newChat = await chatStore.createChat("New Chat", value);
    navigate(`/chat/${newChat.Id}`, {
      state: {
        initialMessage: value,
      },
    });
  };

  return (
    <div className={styles.inputWrapper}>
      <div className={styles.inputBox}>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a message..."
        />

        <button
          className={styles.sendButton}
          onClick={() => (isNewChat ? handleCreateChat() : handleEvent(value))}
        >
          Send
        </button>
      </div>
    </div>
  );
});

export default InputMessage;
