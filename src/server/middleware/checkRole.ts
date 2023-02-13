import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the user ID from previous midleware
        const id = res.locals.jwtPayload.id;
        const prisma = new PrismaClient();

        //Get user role from the database
        const userRepository = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
        let user: any = User;
        try {
            user = userRepository;
            // console.log(user);
        } catch (id) {
            res.status(401).send("id =>" + id);
        }

        //Check if array of authorized roles includes the user's role
        if (roles.indexOf(user.role) > -1) next();
        else res.status(401).send("Unthaurized");
    };
};