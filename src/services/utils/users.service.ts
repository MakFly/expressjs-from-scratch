import { Prisma, PrismaClient } from "@prisma/client";
import { User } from "../../models/User";
import { hashPassword } from "../crypt.services";

const prisma = new PrismaClient();

export class UserService {
    static getUsers = async (email: string): Promise<User> => {
        return prisma.user.findUniqueOrThrow({
            where: {
                email: email,
            },
        });
    }

    static getUserByid = async (id: number): Promise<User> => {
        return prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        });
    }

    static addUser = async (body: { email: any; password: any; role: any; }): Promise<User> => {
        //Get parameters from the body
        let { email, password, role } = body;

        let user: Prisma.UserCreateInput;
        user = {
            email: email,
            password: password,
            role: role,
        };

        //Hash the password, to securely store on DB
        hashPassword(user);
        return prisma.user.create({
            data: user,
        });
    }

    static updateUser = async (id: number, body: { email: any; password: any; role: any; }): Promise<User> => {
        //Get values from the body
        const { email, password, role } = body;

        let user: Prisma.UserUpdateInput;
        user = {
            email: email,
            password: password,
            role: role,
        };

        return prisma.user.update({
            where: {
                id: id,
            },
            data: user,
        });
    }

    static deleteUser = async (id: number): Promise<User> => {
        return prisma.user.delete({
            where: {
                id: id,
            },
        });
    }
}
