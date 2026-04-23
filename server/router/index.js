import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user-controller.js";
import chatController from "../controllers/chat-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = new Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration,
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.patch("/profile/edit", authMiddleware, userController.editProfile);

router.post("/message", authMiddleware, chatController.sendStream);
router.get("/chats", authMiddleware, chatController.getAllChats);
router.get("/chats/:chatId", authMiddleware, chatController.getAllHistory);
// router.patch("/chats/:chatId", authMiddleware, chatController.editChat);
router.post("/chats", authMiddleware, chatController.createChat);

export default router;
