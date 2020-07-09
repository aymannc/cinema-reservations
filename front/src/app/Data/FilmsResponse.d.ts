import {Href} from './CinemasResponse';

export interface FilmsResponse {
  _embedded: Embedded;
  _links: Links;
  page: Page;
}

export interface Embedded {
  films?: (Film)[] | null;
}

export interface Film {
  id: number;
  titre: string;
  description: string;
  realisateur?: null;
  dateSortie?: null;
  dure: number;
  rating: number;
  photo: string;
  _links: FilmLinks;
}

export interface FilmLinks {
  self: Href;
  film: Href;
  projections: Projections;
  categorie: Href;
}

export interface Projections {
  href: string;
  templated: boolean;
}

export interface Links {
  self: Href;
  profile: Href;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
