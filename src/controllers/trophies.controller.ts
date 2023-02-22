import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { TrophiesType } from "../models/Trophies";
import { trophiesDto } from "../dto/trophies.dto";

const prisma = new PrismaClient();

class TrophyController {
  static listAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['Trophy']

    //Get trophie from database
    const trophie: TrophiesType[] = await prisma.trophies.findMany();

    //Send the trophie object
    res.status(200).send({ trophie });
  };

  static getOneByid = async (req: Request, res: Response) => {
    // #swagger.tags = ['Trophy']
    const userIdJwt: number = parseInt(res.locals.jwtPayload.id);

    const trophies: TrophiesType[] = await prisma.trophies.findMany({
      where: {
        userId: userIdJwt,
      },
    });

    let data: any;
    trophies.map((res: any) => (data = res));

    const trophieDto: trophiesDto = {
      nameTrophies: data.id,
      label: data.label,
      value: data.value,
      tier: data.tier,
    };
    res.status(200).send({ results: trophieDto });
  };

  static newUserTrophie = async (req: Request, res: Response) => {
    // #swagger.tags = ['Trophy']

    // Find userId
    const userId: number = parseInt(res.locals.jwtPayload.id);

    //Get parameters from the body
    let { nameTrophies, label, value, earned, tier } = req.body;

    let trophie: Prisma.TrophiesUncheckedCreateInput;
    trophie = {
      nameTrophies: nameTrophies,
      label: label,
      value: value,
      earned: earned,
      tier: tier,
      userId: userId,
    };

    try {
      await prisma.trophies.create({ data: trophie });
    } catch (e) {
      res.status(409).send(e);
      return;
    }

    // #swagger.responses[201] = { description: 'Last 30 days registered successfully.' }
    res.status(201).send("Trophie created");
  };

  // Event to created a completed trophy
  static eventAddTrophie = (req: Request, res: Response) => {
    const data = "";

    res.status(201).send({ message: "event updated", result: data });
    return;
  };

  // Delete manually trophy
  static deleteTrophy = (req: Request, res: Response) => {
    res.status(200).send({ message: "Delete Trophy successfull" });
    return;
  };
}

export default TrophyController;
