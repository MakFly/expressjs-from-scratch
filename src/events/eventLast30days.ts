import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";
import { Last30Days, Last30DaysType } from "../models/last30Days";
import { last30daysService } from "../services/utils/last30days.services";

const prisma = new PrismaClient();

export class EventLast30Days {
  // Nous devons rechercher tt les workout que l'utilisateur a accomplit
  // Additionner le nombre de km parcourue via tous les workouts
  // Additionner le temps total => le ressortir en heures + mn
  // Calculer combien de km/mn il a pu effectué durant tt ses workouts ( formule = v = d / t)
  // v = vitesse , d = distance , t = temps en heure ( le t se calcule : 8h41mn = 8 + (41/60))
  // Récupéré l'object trophée qui est égale au dernier trophé accomplit

  static eventLast30days = async (res: Response, next: NextFunction) => {
    const userId: number = parseInt(res.locals.jwtPayload.id);

    // You find on the user's profile page of data in last 30 days
    const existLast30days: Last30Days[] = await prisma.last30days.findMany({
      where: {
        userId: userId,
      },
    });

    let findUserByid: Last30DaysType;
    if (existLast30days.length === 0) {
      findUserByid = {
        exist: false,
        data: []
      }
    } else if (existLast30days.length >= 1) {
      findUserByid = {
        exist: true,
        data: existLast30days
      }
    }

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

    // console.log(workoutUser);
    if (workoutUser.length > 0) {
      const idLastTrophies = await last30daysService.findFirstLastTrophie();

      let idLast30days: number = 0;
      let workoutNumber: number = 0;
      if (idLastTrophies.id !== undefined) {
        if (findUserByid.exist !== false) {
          idLast30days = findUserByid.data.find(last30Days => last30Days.id)?.id;
          console.log("🚀 ~ file: eventEmitter.ts:51 ~ EventEmitter ~ addLast30Days= ~ idLast30days", idLast30days)

          workoutNumber = findUserByid.data.find(last30Days => last30Days.id)?.workoutNumber;
          console.log("🚀 ~ file: eventEmitter.ts:53 ~ EventEmitter ~ addLast30Days= ~ workoutNumber", workoutNumber)
        }
      } else {
        console.log("Please wait...")
        // return res.status(200).json({ message: "Not resume for the moment in your profile" })
      }

      // Merge Object
      const mergeData = last30daysService.mergeObject(workoutUser, idLastTrophies);

      // Find create Input fields for the last30Days
      const data = last30daysService.createInputLast30days(mergeData, userId);

      let eventResult: { id: number; workoutNumber: number; totalKilometer: string; totalTime: string; fastestKilometer: string; trophiesId: number; userId: number; };
      if (findUserByid.exist === false) {
        eventResult = await last30daysService.add(data);
      } else if (workoutNumber != data.workoutNumber) {
        eventResult = await last30daysService.update(data, idLast30days);
      } else {
        eventResult = await last30daysService.findData(userId);
      }
      prisma.$disconnect();

      return eventResult
    } else {
      return { status: 401 }
    }
  };
}