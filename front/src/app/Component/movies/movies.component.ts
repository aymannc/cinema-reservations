import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import Movie from '../../Data/Movie';
import {CinemaService} from '../../Service/cinema.service';
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies: Movie[];
  pageSize = 10;
  pageIndex = 1;
  totalElements = 10;
  isLoading = false;

  constructor(private router: Router, private cinemaService: CinemaService,
              private modal: NzModalService) {
  }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(pageSizeChanged = false) {
    this.isLoading = true;
    this.cinemaService.getFilms(this.pageSize, pageSizeChanged ? 1 : this.pageIndex).subscribe(data => {
      console.log(data);
      // @ts-ignore
      this.movies = data._embedded.films;
      // @ts-ignore
      this.totalElements = data.page.totalElements;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    });

  }

  goToAddMovie() {
    this.router.navigateByUrl('movies/add');
  }

  goToDetails(id: number) {
    if (id !== null) {
      this.router.navigateByUrl('movies/details/' + id);
    }
  }

  deleteMovie(id: number) {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this movie?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.cinemaService.deleteMovie(id).subscribe(response => {
        this.getMovies();
      }, error => {
        console.log(error);
      }),
      nzCancelText: 'No',
    });
  }

  editMovie(id: number) {
    if (id !== null) {
      this.router.navigateByUrl('movies/modify/' + id);
    }
  }
}
