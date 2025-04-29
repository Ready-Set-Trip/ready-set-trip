// need to set paramters for a user in a specific trip - POST REQ -(i.e. Will's big Cancun bash requires 20 WORKOUTS, 30 HEALTHY DAYS OF EATING, and 50 10 minut dup sessions)
// Will also need a function for the front end to retrive this info (GET REQ)

import express from 'express';

const router = express.Router();
// root of this file is localhost:3000/tripParameters/ (used to be /characters)

// router.get('/:id', swapiController.getMoreCharacterData, (req, res) => {
//   res.status(200).json({ gotCharacters: res.locals.moreCharacters });
// });

// router.post('/', characterController.createCharacter, fileController.saveCharacter, (req, res) => {
//   res.status(200).json({ characters: res.locals.newCharacter });
// });

export default router;
