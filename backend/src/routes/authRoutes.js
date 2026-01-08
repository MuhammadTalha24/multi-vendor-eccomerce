import express from "express";
const Router = express.Router();
import { login, register, logout, forgotPassword, resetPassword, getMe } from "../controllers/authController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";


Router.post("/register", register);
Router.post("/login", login);
Router.post('/logout', protect, logout);
Router.post('/forgot-password', forgotPassword);
Router.post('/reset-password/:token', resetPassword);
Router.get('/me', protect, getMe);





export default Router;

