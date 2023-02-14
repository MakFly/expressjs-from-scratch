import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();
//Login route
router.post("/login", AuthController.login);

router.post("/refreshtoken", AuthController.refreshLogin)

//Change my password
// router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;