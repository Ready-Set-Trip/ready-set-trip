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
      // TODO checking the name column instead of the ID column. 
      // can't figure out how the GroupTripPage code can easily pass the userID instead of the name to the handle
      const result = await db.query(`UPDATE users SET ${habit}_count = ${habit}_count + 1 WHERE name = $1 RETURNING ${habit}_count`, [user]);
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
