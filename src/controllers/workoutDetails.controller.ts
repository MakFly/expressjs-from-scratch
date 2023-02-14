import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { WorkoutDetails } from "../models/workoutDetails";

const prisma = new PrismaClient();

class WorkoutDetailsController {
  static listAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['Workout-Details']

    //Get workoutsDetails from database
    const workoutsDetails: WorkoutDetails[] =
      await prisma.workoutDetails.findMany();

    //Send the users object
    res.send(workoutsDetails);
  };

  static getWorkoutDetailsByUserId = async (req: Request, res: Response) => {
    // #swagger.tags = ['Workout-Details']

    const userIdJwt: number = parseInt(res.locals.jwtPayload.id);
    const idParams = parseInt(req.params.id);

    if (idParams !== userIdJwt) {
      res.status(401).send({ message: 'Invalid user id.' });
      return;
    }

    const workoutDetails: WorkoutDetails[] = await prisma.workoutDetails.findMany({
      where: {
        workouts: {
          userId: userIdJwt
        }
      },
      include: {
        workouts: true
      },
    });

    res.send(workoutDetails);
  };
}

export default WorkoutDetailsController;
