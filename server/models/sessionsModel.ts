import { SessionInput, SessionRow, SessionWithMovie } from '../types';
import { db } from '../db';

class SessionsModel {
  static async getAll(): Promise<SessionWithMovie[]> {
    const query = `
      SELECT s.id, s.movie_id, m.title AS movie_title, s.hall, s.session_date, s.start_time, s.price
      FROM sessions s
      JOIN movies m ON s.movie_id = m.id
      ORDER BY s.id
    `;
    return db.any<SessionWithMovie>(query);
  }

  static async getById(id: number): Promise<SessionWithMovie | null> {
    const query = `
      SELECT s.id, s.movie_id, m.title AS movie_title, s.hall, s.session_date, s.start_time, s.price
      FROM sessions s
      JOIN movies m ON s.movie_id = m.id
      WHERE s.id = $1
    `;
    return db.oneOrNone<SessionWithMovie>(query, [id]);
  }

  static async create(sessionData: SessionInput): Promise<SessionRow> {
    const { movie_id, hall, session_date, start_time, price } = sessionData;
    const query = `
      INSERT INTO sessions (movie_id, hall, session_date, start_time, price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, movie_id, hall, session_date, start_time, price
    `;
    return db.one<SessionRow>(query, [movie_id, hall, session_date, start_time, price]);
  }

  static async update(id: number, sessionData: SessionInput): Promise<SessionRow | null> {
    const { movie_id, hall, session_date, start_time, price } = sessionData;
    const query = `
      UPDATE sessions
      SET movie_id = $1, hall = $2, session_date = $3, start_time = $4, price = $5
      WHERE id = $6
      RETURNING id, movie_id, hall, session_date, start_time, price
    `;
    return db.oneOrNone<SessionRow>(query, [movie_id, hall, session_date, start_time, price, id]);
  }

  static async delete(id: number): Promise<{ id: number } | null> {
    const query = `DELETE FROM sessions WHERE id = $1 RETURNING id`;
    return db.oneOrNone<{ id: number }>(query, [id]);
  }
}

export default SessionsModel;
