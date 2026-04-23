import { observer } from "mobx-react-lite";
import { Context } from "../../../main";
import { useContext, useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import EmojiPicker from "emoji-picker-react";
import styles from "./ProfileModal.module.css";
import { toast } from "react-toastify";

const ProfileModal = observer(({ isOpen, onClose }) => {
  const { authStore } = useContext(Context);
  const user = authStore.user;
  const [isEdit, setEdit] = useState(false);
  const [emoji, setEmoji] = useState("");

  const fullName = [user.name, user.surname].filter(Boolean).join(" ");

  const handleEditProfile = async () => {
    try {
      await authStore.editProfile(emoji);
      toast.success("Profile was successfully edited!");
      setEdit(false);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
      toast.error("Something get wrong.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setEmoji(user?.Avatar || "😀");
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      handleRequest={handleEditProfile}
      showFooter={true}
    >
      <div className={styles.wrapper}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar} onClick={() => setEdit((p) => !p)}>
            {emoji}

            <div className={styles.avatarEdit}>Edit</div>
          </div>
        </div>

        {isEdit && (
          <div className={styles.emojiPicker}>
            <EmojiPicker onEmojiClick={(e) => setEmoji(e.emoji)} />
          </div>
        )}
        <div className={styles.infoList}>
          {fullName && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Full name</span>
              <span className={styles.infoValue}>{fullName}</span>
            </div>
          )}
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user.email}</span>
          </div>
          <button
            className={styles.logoutRow}
            onClick={() => authStore.logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
});

export default ProfileModal;
