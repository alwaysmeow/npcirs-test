import { MovieInput, MovieRow } from '../types';
import { db } from '../db';

class MoviesModel {
  static async getAll(limit = 10, offset = 0): Promise<MovieRow[]> {
    const query = `
      SELECT id, title, genre, duration, rating, release_date
      FROM movies
      ORDER BY id
      LIMIT $1 OFFSET $2
    `;
    return db.any<MovieRow>(query, [limit, offset]);
  }

  static async getById(id: number): Promise<MovieRow | null> {
    const query = `
      SELECT id, title, genre, duration, rating, release_date
      FROM movies
      WHERE id = $1
    `;
    return db.oneOrNone<MovieRow>(query, [id]);
  }

  static async create(movieData: MovieInput): Promise<MovieRow> {
    const { title, genre, duration, rating, release_date } = movieData;
    const query = `
      INSERT INTO movies (title, genre, duration, rating, release_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, genre, duration, rating, release_date
    `;
    return db.one<MovieRow>(query, [title, genre, duration, rating, release_date]);
  }

  static async update(id: number, movieData: MovieInput): Promise<MovieRow | null> {
    const { title, genre, duration, rating, release_date } = movieData;
    const query = `
      UPDATE movies
      SET title = $1, genre = $2, duration = $3, rating = $4, release_date = $5
      WHERE id = $6
      RETURNING id, title, genre, duration, rating, release_date
    `;
    return db.oneOrNone<MovieRow>(query, [title, genre, duration, rating, release_date, id]);
  }

  static async delete(id: number): Promise<{ id: number } | null> {
    const query = `DELETE FROM movies WHERE id = $1 RETURNING id`;
    return db.oneOrNone<{ id: number }>(query, [id]);
  }
}

export default MoviesModel;
