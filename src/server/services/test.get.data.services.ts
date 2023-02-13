import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "../models/User";

const prisma = new PrismaClient();

export const getDataById = async (res: Response, object: any, dataPrisma: any) => {
  const userIdJwt: number = parseInt(res.locals.jwtPayload.userId);

  // On cherche l'id de l'utilisateur connecté
  const userId: User = await prisma.user.findFirst({
    where: {
      id: userIdJwt,
    },
  });

  // S'il est différent du jwt on ne l'autorise pas
  if (userId.id != userIdJwt) {
    res.status(401).send();
    return;
  }

  // On récupère la donnée du model envoyé
  object = await dataPrisma.findMany({
    where: {
      userId: userIdJwt,
    },
  });

  console.log(object)

  res.send(object);
};
