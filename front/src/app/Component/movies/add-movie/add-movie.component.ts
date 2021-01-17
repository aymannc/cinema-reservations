import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalService, UploadFile} from 'ng-zorro-antd';
import {CinemaService} from '../../../Service/cinema.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import Movie from '../../../Data/Movie';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  movie: Movie;
  validateForm!: FormGroup;
  fileList: UploadFile[] = [];
  isLoading: boolean;
  routerSubscription: Subscription;
  modifyMode: boolean;

  constructor(private modal: NzModalService, private fb: FormBuilder,
              private cinemaService: CinemaService, private router: Router,
              private route: ActivatedRoute) {
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [file];
    return false;
  }


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      titre: [null, [Validators.required]],
      description: [null, [Validators.required]],
      realisateur: [null, [Validators.required]],
      dateSortie: [null, [Validators.required]],
      dure: [null, [Validators.required, this.cinemaService.onlyNumbers, Validators.min(0)]],
      rating: [null, [Validators.required, this.cinemaService.onlyNumbers, Validators.max(10), Validators.min(0)]],
    });
    if (this.route.snapshot.url.toString().includes('modify')) {
      this.modifyMode = true;
      this.routerSubscription = this.route.params.subscribe((p: Params) => {
          this.cinemaService.getMovie(+p.id).subscribe((movie: Movie) => {
            this.isLoading = false;
            this.movie = movie;
            this.validateForm.get('titre').setValue(movie.titre);
            this.validateForm.get('description').setValue(movie.description);
            this.validateForm.get('realisateur').setValue(movie.realisateur);
            this.validateForm.get('dateSortie').setValue(movie.dateSortie);
            this.validateForm.get('dure').setValue(movie.dure);
            this.validateForm.get('rating').setValue(movie.rating);
          }, _ => {
            this.isLoading = false;
            this.movie = null;
          });
        }
      );
    }

  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.done();
    }
  }

  done(): void {
    if (this.fileList.length === 0 && !this.modifyMode) {
      this.modal.error({
        nzTitle: '<i>You didn\'t specify an image!</i>',
        nzOnOk: () => {
        }
      });
    } else {
      this.callApi();
    }

  }

  private callApi() {
    this.isLoading = true;
    let results: Observable<Movie>;
    if (this.modifyMode) {
      results = this.cinemaService.modifyFilm(this.fileList, this.movie, this.validateForm.getRawValue());
    } else {
      results = this.cinemaService.addFilm(this.fileList, this.validateForm.getRawValue());
    }
    results.subscribe((response: Movie) => {
        this.isLoading = false;
        if (response?.id) {
          this.router.navigateByUrl('/movies/details/' + response.id);
        } else {
          this.modal.error({
            nzTitle: 'Error',
            nzContent: 'The returned movie id is null'
          });
        }
      }
      , error => {
        this.isLoading = false;
        this.modal.error({
          nzTitle: 'Error',
          nzContent: error.error.status + ', ' + error.error.error
        });
        console.log(error);
      });

  }
}
