import { Router } from "express";
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";
import { Roles } from "../models/enum/enumRoles";
import WorkoutController from "../controllers/workout.controller";

const router = Router();

//Get all workout
router.get("/", [checkJwt, checkRole([Roles.USER, Roles.ADMIN])], WorkoutController.listAll);

router.post("/", [checkJwt, checkRole([Roles.USER, Roles.ADMIN])], WorkoutController.addWorkout);

export default router;