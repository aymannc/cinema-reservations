export interface CinemasResponse {
  _embedded: Embedded;
  _links: CinemasResponseLinks;
  page: Page;
}

export interface Embedded {
  cinemas?: (Cinema)[] | null;
}

export interface Cinema {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
  nombreSales: number;
  _links: CinemaEntityLinks;
}

export interface CinemaEntityLinks {
  self: Href;
  cinema: Href;
  ville: Href;
  salles: Href;
}

export interface Href {
  href: string;
}

export interface CinemasResponseLinks {
  self: Href;
  profile: Href;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
