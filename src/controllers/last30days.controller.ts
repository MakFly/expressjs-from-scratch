import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ModelLast30Days } from "../models/last30Days";
import { EventLast30Days } from "../events/eventLast30days";

const prisma = new PrismaClient();

class Last30DaysController {
  // Get All last30days
  static listAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['Last 30 days']

    //Get last30days from database
    const last30days: ModelLast30Days[] = await prisma.last30days.findMany();

    if ( last30days.length === 0 ) {
      return res.status(204).send([]);
    }

    //Send the last30days object
    res.status(200).send(last30days);
    return;
  };

  static getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // #swagger.tags = ['Last 30 days']

    const data = EventLast30Days.eventLast30days(res);
    data
      .then((data: any) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        next(error)
      })
    return;
  };

  // Update of profile by user id on the last 30 days
  static updateProfile = async (req: Request, res: Response) => {
    // #swagger.tags = ['Last 30 days']
    /*
    Nous devons pouvoir update le résultat des 30 derniers jours si on c'est trompé
    */
  };

  static deleteLast30DaysByUser = async (req: Request, res: Response) => {
    // #swagger.tags = ['Last 30 days']
    /*
    Nous devons pouvoir supprimer le résultat des 30 derniers jours
    */
  };
}

export default Last30DaysController;
