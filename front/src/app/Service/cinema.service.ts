import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  baseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {
  }

  getCities() {
    return this.http.get(this.baseUrl + 'villes');
  }

  getCinemas(url: string) {
    return this.http.get(url);
  }

  getSalles(selectedCinema: any) {
    return this.http.get(selectedCinema._links.salles.href);
  }

  getProjection(salle: any) {
    const url = salle._links.projections.href.replace('{?projection}', '') + '?projection=FilmProjection';
    return this.http.get(url);
  }

  orderTickets(p: { tickets: number[]; codePayment: string; nomClient: string }) {
    return this.http.post(this.baseUrl + 'buyTickets', p);
  }


  fetchTickets(tickets: any) {
    return this.http.get(tickets);
  }
}
