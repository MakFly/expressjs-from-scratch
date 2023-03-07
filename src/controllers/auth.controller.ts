import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../models/User";
import { checkIfUnencryptedPasswordIsValid } from "../services/crypt.services";
import { UserService } from "../services/utils/users.services";

class AuthController {
  // Login
  static login = async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Authentication']

    //Check if username and password are set
    let { email, password } = req.body;
    if (!(email || password)) {
      console.log(req.body)
      res.status(400).send({
        message: "missing_required_parameter",
        info: "email or password",
      });
      return;
    }
    
    let userRepository: User;
    try {
      //Get user from database
      userRepository = await UserService.getUsers(email)
        .then(res => { return res })
      res.status(200);
    } catch (error) {
      res.json({ status: 404, message: "User not found" });
      res.status(404);
      return;
    }

    let count = Object.keys(userRepository).length;
    if (count > 0) {
      try {
        const user: User = userRepository;
        //Check if encrypted password match
        if (!checkIfUnencryptedPasswordIsValid(password, user)) {
          res.status(401).send("Password failed");
          return;
        }

        //Sing JWT, valid for 20 second for test with refreshToken at 1 hour
        const accessToken = this.generateToken(user);
        const refreshToken = this.refreshToken(user);

        //Send the jwt in the response
        res.status(201).send({ accessToken, refreshToken, roles: user.role });
        return;
      } catch (error) {
        res.status(401).send(error);
        return;
      }
    } else {
      res.status(404).send("No user in database");
      return;
    }
  };

  static refreshLogin = (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"] || req.body.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    try {
      <any>jwt.verify(token, config.jwtRefreshSecret, (err: any, user: any) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized" });
        }

        // TODO: Check in databases if user is still active
        delete user.iat;
        delete user.exp;

        const accessToken = this.generateToken(user);
        const refreshedToken = this.refreshToken(user);
        res.send({
          message: "Authentication refresh Token successful",
          accessToken: accessToken,
          refreshedToken: refreshedToken
        });
      });
    } catch (error) {
      res.status(401).send(error);
    }
  };

  // Generate Token
  static generateToken = (user: User) => {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
      // expiresIn: "20s",
      expiresIn: "1h",
    });
  };

  // Refresh Token
  static refreshToken = (user: User) => {
    return jwt.sign(
      { id: user.id, email: user.email },
      config.jwtRefreshSecret,
      { expiresIn: "1h" }
    );
  };

  // static changePassword = async (req: Request, res: Response) => {
  //     //Get ID from JWT
  //     const id = res.locals.jwtPayload.userId;

  //     //Get parameters from the body
  //     const { oldPassword, newPassword } = req.body;
  //     if (!(oldPassword && newPassword)) {
  //         res.status(400).send();
  //     }

  //     //Get user from the database
  //     const userRepository = getRepository(User);
  //     let user: User;
  //     try {
  //         user = await userRepository.findOneOrFail(id);
  //     } catch (id) {
  //         res.status(401).send();
  //     }

  //     //Check if old password matchs
  //     if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
  //         res.status(401).send();
  //         return;
  //     }

  //     //Validate de model (password lenght)
  //     user.password = newPassword;
  //     const errors = await validate(user);
  //     if (errors.length > 0) {
  //         res.status(400).send(errors);
  //         return;
  //     }
  //     //Hash the new password and save
  //     user.hashPassword();
  //     userRepository.save(user);

  //     res.status(204).send();
  // };
}
export default AuthController;
