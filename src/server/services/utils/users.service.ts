import { PrismaClient } from "@prisma/client";
import { User } from "../../models/User";

const prisma = new PrismaClient();

class UserService {
    static getUsers = async (email: string): Promise<User> => {
        return await prisma.user.findUniqueOrThrow({
            where: {
                email: email,
            },
        });
    }

}

export default UserService;