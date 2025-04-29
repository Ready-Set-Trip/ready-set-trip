import db from '../models/databaseModel';
import { Request, Response, NextFunction } from 'express';

interface UsersController {
  incrementHabit(req: Request, res: Response, next: NextFunction): Promise<void>;
}
const usersController: UsersController = {
  async incrementHabit(req, res, next) {
    const { user, habit } = req.params;
    console.log(user, habit)
    try {
      const result = await db.query(`UPDATE users SET ${habit} = ${habit} + 1 WHERE id = $1 RETURNING ${habit}`, [user]);
      res.locals.countAfterIncrement = Object.values(result.rows[0])[0];
      console.log('countAfterIncrement', res.locals.countAfterIncrement)
      return next();
    } catch (error) {
      return next({
        log: 'error in incrementHabit function',
        status: 500,
        message: { err: error.message },
      });
    }
  },
};

export default usersController;
