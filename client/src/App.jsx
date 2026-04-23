import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect } from "react";
import { Context } from "./main";
import LoginForm from "./pages/LoginForm/LoginForm";
import MainPage from "./pages/MainPage/MainPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import { observer } from "mobx-react-lite";
import "./styles/global.css";

const App = observer(() => {
  const { authStore } = useContext(Context);

  useEffect(() => {
    authStore.checkAuth();
  }, []);

  if (authStore.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer position="top-right" />

      <Routes>
        <Route
          path="/login"
          element={authStore.isAuth ? <Navigate to="/" /> : <LoginForm />}
        />

        <Route
          path="/"
          element={authStore.isAuth ? <MainPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/chat/:chatId"
          element={authStore.isAuth ? <ChatPage /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
});

export default App;
