import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import { useContext, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ChatService from "../../services/ChatService";
import InputMessage from "../../components/InputMessage/InputMessage";
import Layout from "../../components/layout/Layout/Layout";
import "katex/dist/katex.min.css";
import styles from "./ChatPage.module.css";
import BouncingDotsLoader from "../../components/ui/BouncingDots/BouncingDots";

const ChatPage = observer(() => {
  const { chatId } = useParams();
  const { chatStore } = useContext(Context);
  const [request, setRequest] = useState("");
  const [isUserAtBottom, setUserBottom] = useState(true);
  const location = useLocation();
  const chatBodyRef = useRef(null);

  const handleSend = (text) => {
    const messageText = String(text ?? request ?? "");
    if (!messageText.trim()) return;

    chatStore.setChatHistory([
      ...chatStore.chatHistory,
      {
        Id: crypto.randomUUID(),
        Content: messageText,
        Role: "user",
      },
    ]);

    setRequest("");
    chatStore.resetStreaming();
    chatStore.setStreaming(true);
    chatStore.setWaitingFirstChunk(true);

    ChatService.sendStream(chatId, messageText, (chunk) => {
      if (chatStore.isWaitingForFirstChunk) {
        chatStore.setWaitingFirstChunk(false);
      }
      chatStore.appendStreamingMessage(chunk);
    }).then(() => {
      const assistantMessage = {
        Id: crypto.randomUUID(),
        Content: chatStore.streamingMessage,
        Role: "assistant",
      };
      chatStore.setChatHistory([...chatStore.chatHistory, assistantMessage]);
      chatStore.resetStreaming();
      chatStore.setStreaming(false);
    });
  };

  useEffect(() => {
    const load = async () => {
      chatStore.setChatId(Number(chatId));

      const initialMessage = location.state?.initialMessage;

      if (initialMessage) {
        window.history.replaceState({}, document.title);
        chatStore.setChatHistory([]);
        handleSend(initialMessage);
      } else {
        await chatStore.fetchChatHistory(chatId);
      }
    };

    load();
  }, [chatId]);

  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;

    const handleScroll = () => {
      const threshold = 100;
      const isBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      setUserBottom(isBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el || !isUserAtBottom) return;
    el.scrollTop = el.scrollHeight;
  }, [chatStore.chatHistory, chatStore.streamingMessage]);

  if (chatStore.isHistoryLoading) {
    return (
      <div className={styles.loader}>
        <BouncingDotsLoader size={24} />
      </div>
    );
  }

  return (
    <Layout>
      <div className={styles.chatWrapper}>
        <div ref={chatBodyRef} className={styles.chatBody}>
          {chatStore.chatHistory.map((msg) => (
            <div
              key={msg.Id}
              className={`${styles.message} ${msg.Role === "user" ? styles.messageUser : styles.messageBot}`}
            >
              <div className={styles.messageInner}>
                <div className={styles.messageContent}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      a: ({ ...props }) => (
                        <a {...props} target="_blank" rel="noreferrer" />
                      ),
                    }}
                  >
                    {msg.Content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {chatStore.isWaitingForFirstChunk && (
            <div className={`${styles.message} ${styles.messageBot}`}>
              <div className={styles.messageInner}>
                <div className={styles.messageContent}>
                  <BouncingDotsLoader size={6} />
                </div>
              </div>
            </div>
          )}

          {chatStore.isStreaming && !chatStore.isWaitingForFirstChunk && (
            <div className={`${styles.message} ${styles.messageBot}`}>
              <div className={styles.messageInner}>
                <div className={styles.messageContent}>
                  {chatStore.streamingMessage}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.chatInput}>
          <InputMessage
            handleEvent={handleSend}
            value={request}
            setValue={setRequest}
            isNewChat={false}
          />
        </div>
      </div>
    </Layout>
  );
});

export default ChatPage;
