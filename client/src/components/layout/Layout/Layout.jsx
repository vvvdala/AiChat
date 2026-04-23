import styles from "./Layout.module.css";
import { Context } from "../../../main";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../../modals/ProfileModal/ProfileModal";
import { SidebarToggleIcon } from "../../ui/icons/SidebarToggleIcon";

const Layout = observer(({ children }) => {
  const { chatStore, authStore } = useContext(Context);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isSidebarOpen, setSideBarOpen] = useState(true);
  const navigate = useNavigate();

  const user = authStore.user;
  const fullName = [user.name, user.surname].filter(Boolean).join(" ");

  useEffect(() => {
    chatStore.fetchUserChats();
  }, []);

  return (
    <div className={styles.layout}>
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarCollapsed}`}
      >
        <div className={styles.sidebarTop}>
          <button
            className={styles.toggleBtn}
            onClick={() => setSideBarOpen((prev) => !prev)}
          >
            <SidebarToggleIcon size={20} />
          </button>

          <button className={styles.newChatBot} onClick={() => navigate("/")}>
            + New chat
          </button>
        </div>

        <div className={styles.chatList}>
          {chatStore.userChats.map((chat) => (
            <div
              key={chat.Id}
              className={`${styles.chatItem} ${
                chat.Id === chatStore.chatId ? styles.chatItemActive : ""
              }`}
              onClick={() => navigate(`/chat/${chat.Id}`)}
            >
              {chat.Title}
            </div>
          ))}
        </div>

        <div
          className={styles.sidebarBottom}
          onClick={() => setProfileOpen(true)}
        >
          <span className={styles.avatar}>{user?.Avatar || "😀"}</span>
          <span className={styles.fullname}>{fullName}</span>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setProfileOpen(false)}
        />
        {children}
      </main>
    </div>
  );
});

export default Layout;
