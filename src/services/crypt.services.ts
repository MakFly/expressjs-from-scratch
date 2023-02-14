import * as bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const hashPassword = (user: User) => {
    user.password = bcrypt.hashSync(user.password, 8);
}

export const checkIfUnencryptedPasswordIsValid = (unencryptedPassword: string, user: User) => {
    return bcrypt.compareSync(unencryptedPassword, user.password);
}