// creates new trip in db POST
// fetches trip for a logged in user GET
// handle invites to a trip by adding a user to the trips table POST?

// get fetch date?

import express from 'express';
import tripsController from '../controllers/tripsController';

const router = express.Router();

router.post('/create', tripsController.createTrip, (req, res) => {
  res.status(201).json({ tripId: res.locals.tripId });
});

router.get('/groupStats/:tripId', tripsController.getGroupStats, (req, res) => {
  res.status(200).json({ usersAndTrackers: res.locals.usersAndTrackers });
});

router.get('/validate-id/:tripId', tripsController.validate, (req, res) => {
  res.sendStatus(200);
});

export default router;
