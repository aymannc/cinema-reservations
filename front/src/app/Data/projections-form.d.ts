export interface ProjectionsForm {
  movieId: number;
  roomId: number;
  projections: Projection[];
}

export interface Projection {
  date: string;
  price: number;
}
