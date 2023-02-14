import express from 'express';
import auth from "./auth";
import users from "./users";
import workoutDetails from "./workout.details";
import workout from "./workout";
import last30days from './last30days'

const router = express.Router()

router.use("/auth", auth);
router.use("/users", users);
router.use("/last", last30days)
router.use("/workout", workout);
router.use("/workout/details", workoutDetails);


export default router;