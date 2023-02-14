import { Router } from "express";
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";
import { Roles } from "../models/enum/enumRoles";
import WorkoutDetailsController from "../controllers/workoutDetails.controller";

const router = Router();

//Get all workout Details
router.get("/", [checkJwt, checkRole([Roles.USER, Roles.ADMIN])], WorkoutDetailsController.listAll);

//Get workoutDetailsByUserId
router.get("/:id", [checkJwt, checkRole([Roles.USER, Roles.ADMIN])], WorkoutDetailsController.getWorkoutDetailsByUserId);

export default router;