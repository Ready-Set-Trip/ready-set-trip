import db from '../models/databaseModel';
import { Request, Response, NextFunction } from 'express';

// TODO: make logic to have slightly more secure tripId.
// don't know if I want to hash it or just do some logic to generate a shorter string based on tableId
// if logic based on tableId, it might save some trips between frontend/server/db??
// (if I make the tripId able to be reverse engineered into the tableId)

// trip IDs will be 5 characters long, 1 letter + 4 numbers
// do some math to basically create a simple, insecure, two-way hashing algorithm
const generateTripId = (tableId: number): string => {
  // obfuscate the table Id by multiplying a prime and adding a hard-to-guess offest
  const obfuscatedId = tableId * 13 + 841;
  // generate a "random" letter based on the obfuscated table ID
  const letter = String.fromCharCode(65 + (obfuscatedId % 26));
  // generate a "random" string of 4 numbers based on the obfuscated table ID
  const numbers = String(obfuscatedId).padStart(4, '0');
  return letter + numbers;
};

const decodeTripId = (tripCode: string): number => {
  const numbersPart = parseInt(tripCode.slice(1));
  const decodedId = (numbersPart - 841) / 13;
  return decodedId;
};

interface TripsController {
    createTrip(req: Request, res: Response, next: NextFunction): Promise<void>;
    getGroupStats(req: Request, res: Response, next: NextFunction): Promise<void>;
  }

const tripsController: TripsController = {
  async createTrip(req, res, next) {
    // TODO: frontend still sending emails
    // should I be storing emails or unique user_ids?
    // Definitely need to send countdown_start and trip_start dates
    // do I need to send those back in the response for the Countdown purposes?
    const { tripName } = req.body;
    try {
      const result = await db.query('INSERT INTO trips (trip_name) VALUES ($1) RETURNING *', [tripName]);
      res.locals.tripId = generateTripId(result.rows[0].id as number);
      console.log(res.locals.tripId);
      return next();
    } catch (error) {
      return next({
        log: 'error in createTrip function',
        status: 500,
        message: { err: error.message },
      });
    }
  },

  async getGroupStats(req, res, next) {
    const { tripId } = req.params;
    console.log('tripId', tripId);
    const tripTableId = decodeTripId(tripId);
    console.log('tripTableId', tripTableId);
    try {
      // TODO: should we return the unique user ID instead of email for unique identifier?
      const result = await db.query(
        'SELECT name, id, workout_count, diet_count, language_count FROM users WHERE trip_id = $1',
        [tripTableId]
      );
      console.log('result.rows: ', result.rows);
      res.locals.usersAndTrackers = result.rows;
      return next();
    } catch (error) {
      return next({
        log: 'error in getGroupStats function',
        status: 500,
        message: { err: error.message },
      });
    }
  },
};

export default tripsController;
