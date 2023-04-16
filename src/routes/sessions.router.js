import { Router } from "express";
import passport from "passport";
import { passportCall } from "../middleware/auth.js"
import {
  register,
  login,
  logout,
  getUser,
} from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", passportCall("register"), register);
router.post("/login", passportCall("login"), login);
router.get("/logout", passportCall("current"), logout);
router.get("/current", passportCall("current"), getUser);
router.get( "/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});
router.post("/password_reset", passportCall("current"), "controller function");
router.post("/password_reset/:uid/:token", "controller function")
export default router;