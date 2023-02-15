import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";
import { Last30Days, Last30DaysType } from "../models/last30Days";
import { Last30daysService } from "../services/utils/last30days.services";

const prisma = new PrismaClient();

export class EventLast30Days {
  // We need to search for all the workouts that the user has completed
  // Add up the number of kilometers covered by all the workouts
  // Add up the total time => get it in hours + minutes
  // Calculate how many km/mn he could do during all his workouts (formula = v = d / t)
  // v = speed, d = distance, t = time in hours (t is calculated : 8h41mn = 8 + (41/60))
  // Recover the trophy object which is equal to the last trophy accomplished

  static eventLast30days = async (res: Response) => {

    // Find userId
    const userId: number = parseInt(res.locals.jwtPayload.id);

    // Find idLastTrophies
    const idLastTrophies = await Last30daysService.findFirstLastTrophie();

    // You find on the user's profile page of data in last 30 days
    const existLast30days: Last30Days[] = await prisma.last30days.findMany({
      where: {
        userId: userId,
      },
    });

    const workoutUser = await prisma.workoutDetails.findMany({
      where: {
        workouts: {
          userId: userId
        }
      },
      include: {
        workouts: true
      },
    });

    if (workoutUser.length > 0) {

      let dataUserLast30days: Last30DaysType;

      // Merge Object
      const merge = Last30daysService.mergeObject(workoutUser, idLastTrophies)

      // Find create Input fields for the last30Days
      const data = Last30daysService.createInputLast30days(merge, userId);

      if (existLast30days.length > 0) {
        dataUserLast30days = {
          exist: true,
          data: existLast30days
        }
      } else {
        await Last30daysService.add(data);
        return await Last30daysService.findData(userId);
      }

      let idLast30days: number = dataUserLast30days.data.find(last30Days => last30Days.id)?.id;
      let workoutNumber: number = dataUserLast30days.data.find(last30Days => last30Days.id)?.workoutNumber;

      // Find last 30 days id trophy
      const lastTrophy30days = await Last30daysService.findLastTrophy30days(idLast30days);

      if (idLastTrophies.id !== lastTrophy30days.trophiesId) {
        await Last30daysService.update(data, idLast30days);
      } else if (workoutNumber !== data.workoutNumber) {
        await Last30daysService.update(data, idLast30days);
      }
      return await Last30daysService.findData(userId);
    } else {
      // return { status: 500, message: "workout not found for this user" }
      throw new Error("workout not found for this user");
    }
  };
}