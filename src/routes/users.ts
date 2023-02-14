import { Router } from "express";
import TrophyController from "../controllers/trophies.controller";
import UserController from "../controllers/user.controller";
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";
import { Roles } from "../models/enum/enumRoles";

const router = Router();

//Get all users
router.get("/", [checkJwt, checkRole(["USER", "ADMIN"])], UserController.listAll);

//Create a new user
router.post("/", UserController.newUser);

// Get user role
router.get("/:id([0-9]+)", [checkJwt], UserController.getOneById)

// Edit User
router.patch("/:id([0-9]+)", [checkJwt], UserController.editUser)

// Delete User
router.delete("/:id([0-9]+)", [checkJwt], UserController.deleteUser)

// Get user role
router.get("/role", [checkJwt], UserController.getUserRole)

//Get all trophie if user is admin
router.get("/trophies", [checkJwt, checkRole([Roles.ADMIN])], TrophyController.listAll)

//Get all trophie if user is admin
router.post("/trophies", [checkJwt, checkRole([Roles.ADMIN])], TrophyController.newUserTrophie)

//Get trophies by userId
router.get("/trophie/:id([0-9]+)", [checkJwt, checkRole([Roles.ADMIN])], TrophyController.getOneByid)

export default router;