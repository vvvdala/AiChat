import { createContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AuthStore from "./store/authStore.js";
import ChatStore from "./store/chatStore.js";

const authStore = new AuthStore();
const chatStore = new ChatStore();

export const Context = createContext({
  authStore,
  chatStore,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Context.Provider value={{ authStore, chatStore }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Context.Provider>
  </StrictMode>,
);
