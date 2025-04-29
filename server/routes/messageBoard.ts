import express from 'express';
import messageBoardController from '../controllers/messageBoardController';

const router = express.Router();

router.post('/', messageBoardController.postMessage, (req, res) => {
  res.status(201).json({ msg: `${res.locals.name} logged in!`, jwt: res.locals.token });
});

router.get('/', messageBoardController.getHistory, (req, res) => {
  res.status(200).json({ messages: res.locals.messages });
});
export default router;
