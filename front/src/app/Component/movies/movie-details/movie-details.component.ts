import {Component, OnDestroy, OnInit} from '@angular/core';
import Movie from '../../../Data/Movie';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CinemaService} from '../../../Service/cinema.service';
import {Subscription} from 'rxjs';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
// tslint:disable-next-line:component-class-suffix


export class MovieDetailsComponent implements OnInit, OnDestroy {
  isLoading = true;
  movie: Movie;
  routerSubscription: Subscription;

  constructor(private router: Router, private cinemaService: CinemaService,
              private route: ActivatedRoute, private modal: NzModalService,
              private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.routerSubscription = this.route.params.subscribe((p: Params) => {
        this.cinemaService.getMovie(+p.id).subscribe((movie: Movie) => {
          this.isLoading = false;
          this.movie = movie;
        }, _ => {
          this.isLoading = false;
          this.movie = null;
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  navigateToMovies() {
    this.router.navigateByUrl('/movies');
  }

  modifyMovie() {
    this.router.navigateByUrl('/movies/modify/' + this.movie.id);
  }

  deleteMovie() {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this movie?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.cinemaService.deleteMovie(this.movie.id).subscribe(_ => {
        this.message.create('success', `Movies deleted successfully`, {nzPauseOnHover: true});
        this.movie = null;
      }, error => {
        console.log(error);
      }),
      nzCancelText: 'No',
    });
  }


}
