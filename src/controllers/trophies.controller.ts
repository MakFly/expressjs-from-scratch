import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { TrophiesType } from "../models/Trophies";
import { trophiesDto } from "../dto/trophiesDto";

const prisma = new PrismaClient();

class TrophyController {
  static listAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']

    //Get trophie from database
    const trophie: TrophiesType[] = await prisma.trophies.findMany();

    //Send the trophie object
    res.send(trophie);
  };

  static getOneByid = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    const userIdJwt: number = parseInt(res.locals.jwtPayload.id);

    const trophies: TrophiesType[] = await prisma.trophies.findMany({
      where: {
        userId: userIdJwt,
      },
    });

    let data: any;
    trophies.map((res: any) => data = res);

    const trophieDto: trophiesDto = {
      nameTrophies: data.id,
      label: data.label,
      value: data.value,
      tier: data.tier
    };
    res.status(200).send({ results: trophieDto });
  };

  static newUserTrophie = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']

    const userId: number = parseInt(res.locals.jwtPayload.id);

    //Get parameters from the body
    let { nameTrophies, label, value, earned, tier } = req.body;

    // Récupéré le dernier trophée en date et renvoyer dans l'objet "last30Days"
    // L'objet Trophie

    // Récupéré l'utilisateur en cours et renvoyer dans l'objet "user"
    // L'objet User

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
      console.log(e);
      res.status(409).send(e);
      return;
    }

    // #swagger.responses[201] = { description: 'Last 30 days registered successfully.' }
    res.status(201).send("Trophie created");
  };

  // Créer l'update de trophé ou de plusieurs

  // Créer la suppression d'un trophé ou de plusieurs
}

export default TrophyController;
