import { Router } from "express";
import Last30DaysController from "../controllers/last30days.controller";
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";
import { Roles } from "../models/enum/enumRoles";

const router = Router();

//Get resume on last 30 days
router.get("/resume", [checkJwt, checkRole([Roles.USER, Roles.ADMIN])], Last30DaysController.getProfile);

//Get profile on last 30 days
// router.get("/existlast30days/:id([0-9]+)", [checkJwt, checkRole([Roles.USER, Roles.ADMIN])], Last30DaysController.existLast30days);

//Update Profile on last 30 days
router.post("/profile", Last30DaysController.updateProfile);

export default router;