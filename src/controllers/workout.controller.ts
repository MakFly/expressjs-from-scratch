import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { Workout } from "../models/workout";

const prisma = new PrismaClient();

class WorkoutController {
  static listAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['Workout']
    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    //Get workouts from database
    const workouts: Workout[] = await prisma.workouts.findMany();

    if (workouts.length === 0) {
      return res.status(204).send([]);
    }
    return res.status(200).send(workouts);
  };

  static addWorkout = async (req: Request, res: Response) => {
    // #swagger.tags = ['Workout']
    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */
    /* #swagger.parameters['Workout'] = {
        in: 'body',
        description: 'Adding new workout.',
        schema: {
            "distance": 50.4,
            "time": "10.50",
            "checkpoint": [
              {
                "distance": 3,
                "time": 123,
                "coordinates": {
                  "lat": 50.66841,
                  "lon": 3.1150411
                }
              }
            ],
            "workout": {
              "userId": 1
            }
        }
    } */

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
