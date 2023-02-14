import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { User } from "../models/User";
import { hashPassword } from "../services/crypt.services";
import jwtDecode from "jwt-decode";
import { UserService } from "../services/utils/users.service";

const prisma = new PrismaClient();

class UserController {

  static listAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']

    //Get users from database
    const users: User[] = await prisma.user.findMany();

    // #swagger.responses[200] = { description: 'All Users find successfully.' }
    res.status(200).send(users);
    return;
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = parseInt(req.params.id);

    try {
      //Get the user from database
      const user = await UserService.getUserByid(id).then(user => user);
      res.status(200).send({ user });
      return;
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
  };

  // Find Role by id
  static getUserRole = async (req: Request, res: Response) => {

    const header: any = req.headers['authorization'];
    let token = header.split(" ")[1];
    let decode: any = jwtDecode(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decode.id
      },
      select: {
        role: true
      }
    })

    // #swagger.responses[200] = { description: 'User role find successfully.' }
    res.status(200).send(user);
    return;
  }

  static newUser = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']

    //Try to save. If fails, the email is already in use
    try {
      await UserService.addUser(req.body)
    } catch (e) {
      console.log(e);
      res.status(409).send("email already in use");
      return;
    }

    // #swagger.responses[201] = { description: 'User registered successfully.' }
    res.status(201).send("User created");
    return;
  };

  static editUser = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    const id = parseInt(req.params.id)

    try {
      await UserService.getUserByid(id).then(user => user);
      res.status(200);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("User not found");
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await UserService.updateUser(id, req.body);
    } catch (e) {
      res.status(409).send("email already in use");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    // #swagger.responses[204] = { description: 'User updated successfully.' }
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = parseInt(req.params.id);

      try {
          await UserService.getUserByid(id);
      } catch (error) {
          res.status(404).send("User not found");
          return;
      }
      UserService.deleteUser(id);

      // #swagger.responses[204] = { description: 'User deleted successfully.' }
      res.status(204).send();
  };
}

export default UserController;
