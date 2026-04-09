import { Request, Response } from 'express';
import MoviesModel from '../models/moviesModel';

class MoviesController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const offset = parseInt((req.query.offset as string) || '0', 10);
      const movies = await MoviesModel.getAll(limit, offset);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const movie = await MoviesModel.getById(id);
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const movieData = req.body;
      const newMovie = await MoviesModel.create(movieData);
      res.status(201).json(newMovie);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const movieData = req.body;
      const updatedMovie = await MoviesModel.update(id, movieData);
      if (updatedMovie) {
        res.json(updatedMovie);
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deletedMovie = await MoviesModel.delete(id);
      if (deletedMovie) {
        res.json({ message: 'Movie deleted' });
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default MoviesController;
