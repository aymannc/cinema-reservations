import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UploadFile} from 'ng-zorro-antd';
import Movie from '../Data/Movie';
import {FormControl} from '@angular/forms';
import {City} from '../Data/City';
import {Cinema} from '../Data/CinemasResponse';
import {FilmsResponse} from '../Data/FilmsResponse';

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

  addFilm(fileList: UploadFile[], data: any) {
    const formData = new FormData();
    fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    formData.append('filmData', new Blob([JSON.stringify(data)], {
      type: 'application/json'
    }));
    return this.http.post<Movie>('http://localhost:8080/addFilm', formData);
  }

  onlyNumbers = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (isNaN(control.value)) {
      return {chars: true, error: true};
    }
    return {};
  }

  getFilms(pageSize: number, pageIndex: number) {
    const requestUrl = this.baseUrl + `films?page=${pageIndex - 1}&size=${pageSize}`;
    return this.http.get(requestUrl);

  }

  getMovie(id: number) {
    return this.http.get(this.baseUrl + 'films/' + id);
  }

  getMovies() {
    return this.http.get<FilmsResponse>(this.baseUrl + 'films/');
  }

  getCity(id: number) {
    return this.http.get<City>(this.baseUrl + 'villes/' + id);
  }

  deleteMovie(id: number) {
    return this.http.delete(this.baseUrl + 'films/' + id);
  }

  modifyFilm(fileList: UploadFile[], movie: Movie, rawValue: Movie) {
    const formData = new FormData();

    formData.append('file', null);
    fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    rawValue.id = movie.id;
    rawValue.photo = movie.photo;
    formData.append('filmData', new Blob([JSON.stringify(rawValue)], {
      type: 'application/json'
    }));
    return this.http.post<Movie>(this.baseUrl + 'modifyMovie', formData);
  }

  addCity(formData: any) {
    return this.http.post<City>(this.baseUrl + 'villes', formData);
  }

  deleteCity(id: any) {
    return this.http.delete(this.baseUrl + 'villes/' + id);
  }

  modifyCity(id: number, rawValue: any) {
    return this.http.patch<City>(this.baseUrl + 'villes/' + id, rawValue);
  }

  addCinema(rawValue: any) {
    return this.http.post<boolean>(this.baseUrl + 'addCinema', rawValue);
  }

  deleteCinema(id: any) {
    return this.http.delete(this.baseUrl + 'cinemas/' + id);
  }

  getCinema(id: number) {
    return this.http.get<Cinema>(this.baseUrl + 'cinemas/' + id);
  }

  addProjections(data: { movieId: number; projections: { date: any; price: any }[] }) {
    return this.http.post<boolean>(this.baseUrl + 'updateProjections', data);
  }

  deleteRoom(room: any) {
    if (room?.id) {
      return this.http.delete(this.baseUrl + 'salles/' + room.id);
    }
  }
}
