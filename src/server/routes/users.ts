import { Router } from "express";
import UserController from "../controllers/user.controller";
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";

const router = Router();

//Get all users
router.get("/", [checkJwt, checkRole(["USER", "ADMIN"])], UserController.listAll);

// Get user role
router.get("/:id", [checkJwt], UserController.getOneById)

// Edit User
router.patch("/:id", [checkJwt], UserController.editUser)

// Edit User
router.delete("/:id", [checkJwt], UserController.deleteUser)

// Get user role
router.get("/role", [checkJwt], UserController.getUserRole)

//Create a new user
router.post("/", UserController.newUser);

export default router;