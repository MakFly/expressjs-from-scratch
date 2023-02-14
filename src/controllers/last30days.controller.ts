import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Last30Days } from "../models/last30Days";
import { EventLast30Days } from "../events/eventLast30days";

const prisma = new PrismaClient();

class Last30DaysController {
  // Get All last30days
  static listAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']

    //Get last30days from database
    const last30days: Last30Days[] = await prisma.last30days.findMany();

    //Send the last30days object
    res.status(200).send(last30days);
  };

  static existLast30days = async (req: Request, res: Response) => {
    // const userId: number = parseInt(res.locals.jwtPayload.id);
    // const existLast30days: Last30Days[] = await prisma.last30days.findMany({
    //   where: {
    //     userId: userId,
    //   },
    // });
    // if (existLast30days.length > 0) {
    //   return res.status(201).json({ exist: true, data: existLast30days });
    // } else {
    //   return { exist: false, data: [] };
    // }
  };

  static getProfile = async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Users']

    const data = EventLast30Days.eventLast30days(res, next);
    data.then((data: any) => {
      res.status(200).send(data);
      return;
    })
  };

  // Update of profile by user id on the last 30 days
  static updateProfile = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    /*
    Nous devons pouvoir update le résultat des 30 derniers jours si on c'est trompé
    */
  };

  static deleteLast30DaysByUser = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    /*
    Nous devons pouvoir supprimer le résultat des 30 derniers jours
    */
  };
}

export default Last30DaysController;
