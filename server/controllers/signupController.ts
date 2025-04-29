import bcrypt from 'bcrypt';
import db from '../models/databaseModel';
import { Request, Response, NextFunction } from 'express';

interface SignupController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

// TODO: add an optional field to enter trip ID, will automatically assign user to that trip
// might have to change redirect options
// unless we just want to handle this on the create/join trip page
const signupController: SignupController = {
  async createUser(req, res, next) {
    const { name, email, password } = req.body;
    res.locals.name = name;
    try {
      console.log('trying to createUser');
      const hashedPass = await bcrypt.hash(password, 10);
      res.locals.createdUser = await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [
        name,
        email,
        hashedPass,
      ]);
      return next();
    } catch (error) {
      return next({
        log: 'error in createUser function',
        status: 500,
        message: { err: error.message },
      });
    }
  },
};

export default signupController;
