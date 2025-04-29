import db from '../models/databaseModel';
import { Request, Response, NextFunction } from 'express';

interface MessageBoardController {
  postMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
  getHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
}

// TODO write controller functions
const messageBoardController: MessageBoardController = {
  async postMessage(req, res, next) {
    try {
      return next();
    } catch (error) {
      return next({
        log: 'error in postMessage function',
        status: 500,
        message: { err: error.message },
      });
    }
  },

  async getHistory(req, res, next) {
    try {
        return next();
      } catch (error) {
        return next({
          log: 'error in getHistory function',
          status: 500,
          message: { err: error.message },
        });
      }
  },
};

export default messageBoardController;
