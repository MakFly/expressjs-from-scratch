import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { Workout } from "../models/workout";

const prisma = new PrismaClient();

class WorkoutController {
  static listAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['Workout']

    //Get workouts from database
    const workouts: Workout[] = await prisma.workouts.findMany();

    if (workouts.length === 0) {
      return res.status(404).json({ message: "No workouts found" });
    }
    return res.status(200).send(workouts);
  };

  static newWorkout = async (req: Request, res: Response) => {
    // #swagger.tags = ['Workout']

    //Get parameters from the body
    let { distance, time, checkpoint, workout } = req.body;

    // Create a workout & workout-details
    let workoutDetails: Prisma.WorkoutDetailsCreateInput;
    workoutDetails = {
      distance: distance,
      time: time,
      checkpoint: checkpoint,
      workouts: {
        create: {
          userId: workout.userId,
        },
      },
    };

    try {
      await prisma.workoutDetails.create({
        data: workoutDetails,
      });
    } catch (e) {
      return res.status(409).send(e);
    }

    // #swagger.responses[201] = { description: 'Workout registered successfully.' }
    res.status(201).send("Workout created");
    return;
  };
}

export default WorkoutController;
