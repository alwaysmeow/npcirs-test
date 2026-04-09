export interface MovieInput {
  title: string;
  genre: string;
  duration: number;
  rating: number;
  release_date: string;
}

export interface MovieRow extends MovieInput {
  id: number;
}

export interface SessionInput {
  movie_id: number;
  hall: string;
  session_date: string;
  start_time: string;
  price: number;
}

export interface SessionRow extends SessionInput {
  id: number;
}

export interface SessionWithMovie extends SessionRow {
  movie_title: string;
}
