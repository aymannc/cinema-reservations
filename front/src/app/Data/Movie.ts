export default class Movie {

  constructor(public id: number, public titre: string,
              public description: string, public realisateur: string,
              public dateSortie: string, public dure: number,
              public rating: number, public photo: string) {
  }
}
