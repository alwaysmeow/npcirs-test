import { Request, Response } from 'express';
import SessionsModel from '../models/sessionsModel';

class SessionsController {
  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const sessions = await SessionsModel.getAll();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const session = await SessionsModel.getById(id);
      if (session) {
        res.json(session);
      } else {
        res.status(404).json({ error: 'Session not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const sessionData = req.body;
      const newSession = await SessionsModel.create(sessionData);
      res.status(201).json(newSession);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const sessionData = req.body;
      const updatedSession = await SessionsModel.update(id, sessionData);
      if (updatedSession) {
        res.json(updatedSession);
      } else {
        res.status(404).json({ error: 'Session not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deletedSession = await SessionsModel.delete(id);
      if (deletedSession) {
        res.json({ message: 'Session deleted' });
      } else {
        res.status(404).json({ error: 'Session not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default SessionsController;
