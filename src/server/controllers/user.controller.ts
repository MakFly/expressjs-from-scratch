import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { User } from "../models/User";
import { hashPassword } from "../services/crypt.services";
import jwtDecode from "jwt-decode";

const prisma = new PrismaClient();

class UserController {
  
  static listAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']

    //Get users from database
    const users: User[] = await prisma.user.findMany();

    //Send the users object
    res.status(200).send(users);
    return;
  };

  // static getOneById = async (req: Request, res: Response) => {
  //     //Get the ID from the url
  //     const id: number = req.params.id;

  //     //Get the user from database
  //     const userRepository = getRepository(User);
  //     try {
  //         const user = await userRepository.findOneOrFail(id, {
  //             select: ["id", "username", "role"] //We dont want to send the password on response
  //         });
  //     } catch (error) {
  //         res.status(404).send("User not found");
  //     }
  // };

  static getUserRole = async (req: Request, res: Response) => {

    const header: any = req.headers['authorization'];
    let token = header.split(" ")[1];
    let tokenDecode: any = jwtDecode(token);

    const user = await prisma.user.findUnique({
      where: {
        id: tokenDecode.id
      },
      select: {
        role: true
      }
    })

    res.status(200).send(user);
    return;
  }

  static newUser = async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    
    //Get parameters from the body
    let { email, password, role } = req.body;

    let user: Prisma.UserCreateInput;
    user = {
      email: email,
      password: password,
      role: role,
    };

    //Validade if the parameters are ok
    // const errors = await validate(user);
    // if (errors.length > 0) {
    //     res.status(400).send(errors);
    //     return;
    // }

    //Hash the password, to securely store on DB
    hashPassword(user);

    //Try to save. If fails, the email is already in use
    try {
      await prisma.user.create({ data: user });
    } catch (e) {
      console.log(e);
      res.status(409).send("email already in use");
      return;
    }

    // #swagger.responses[201] = { description: 'User registered successfully.' }
    res.status(201).send("User created");
    return;
  };

  // static editUser = async (req: Request, res: Response) => {
  //     //Get the ID from the url
  //     const id = req.params.id;

  //     //Get values from the body
  //     const { username, role } = req.body;

  //     //Try to find user on database
  //     const userRepository = getRepository(User);
  //     let user;
  //     try {
  //         user = await userRepository.findOneOrFail(id);
  //     } catch (error) {
  //         //If not found, send a 404 response
  //         res.status(404).send("User not found");
  //         return;
  //     }

  //     //Validate the new values on model
  //     user.username = username;
  //     user.role = role;
  //     const errors = await validate(user);
  //     if (errors.length > 0) {
  //         res.status(400).send(errors);
  //         return;
  //     }

  //     //Try to safe, if fails, that means username already in use
  //     try {
  //         await userRepository.save(user);
  //     } catch (e) {
  //         res.status(409).send("username already in use");
  //         return;
  //     }
  //     //After all send a 204 (no content, but accepted) response
  //     res.status(204).send();
  // };

  // static deleteUser = async (req: Request, res: Response) => {
  //     //Get the ID from the url
  //     const id = req.params.id;

  //     const userRepository = getRepository(User);
  //     let user: User;
  //     try {
  //         user = await userRepository.findOneOrFail(id);
  //     } catch (error) {
  //         res.status(404).send("User not found");
  //         return;
  //     }
  //     userRepository.delete(id);

  //     //After all send a 204 (no content, but accepted) response
  //     res.status(204).send();
  // };
}

export default UserController;
