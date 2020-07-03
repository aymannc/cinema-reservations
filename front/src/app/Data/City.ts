export class City {
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
  // tslint:disable-next-line:variable-name
  _links: Links;
}

export class Links {
  self: SelfOrVilleOrCinemas;
  ville: SelfOrVilleOrCinemas;
  cinemas: SelfOrVilleOrCinemas;
}

export class SelfOrVilleOrCinemas {
  href: string;
}
