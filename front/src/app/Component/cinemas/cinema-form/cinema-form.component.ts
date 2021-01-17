import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {CinemaService} from '../../../Service/cinema.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-cinema-form',
  templateUrl: './cinema-form.component.html',
  styles: []
})
export class CinemaFormComponent implements OnInit, OnChanges {
  citiesOptions: Array<{ id: number; city: string }> = [];
  validateForm: FormGroup;
  isLoading: boolean;
  @Input() editCinema: { id: number; city: string; cinemas: string };
  @Input() opened: boolean;

  constructor(private fb: FormBuilder, private message: NzMessageService,
              private cinemaService: CinemaService) {
  }

  ngOnChanges() {
    console.log(this.editCinema);
    if (this.opened) {
      this.getCities();
    }
    if (this.editCinema != null) {
      this.cinemaService.getCinema(this.editCinema.id).subscribe(cinema => {
        this.validateForm.get('name').setValue(cinema.name);
        this.validateForm.get('nbrRooms').setValue(cinema.nombreSales);
        this.validateForm.get('altitude').setValue(cinema.altitude);
        this.validateForm.get('longitude').setValue(cinema.longitude);
        this.validateForm.get('latitude').setValue(cinema.latitude);
      });
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      init: [null],
      city: [null, [Validators.required]],
      name: [null, [Validators.required]],
      altitude: [null],
      longitude: [null],
      latitude: [null],
      nbrRooms: [null, [Validators.required, this.cinemaService.onlyNumbers, Validators.min(1)]],
    });
  }

  getCities() {
    console.log('called');
    if (!this.isLoading) {
      this.isLoading = true;
      this.cinemaService.getCities().subscribe(result => {
        this.isLoading = false;
        this.citiesOptions = [];
        // @ts-ignore
        result._embedded.villes.forEach(v => {
          this.citiesOptions.push({id: v.id, city: v.name});
        });
        this.validateForm.get('city').setValue(this.citiesOptions[0].id);
      }, () => {
        this.isLoading = false;
      });
    }
  }

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm) {
      this.callApi();
    }
  }

  private callApi() {
    console.log(this.validateForm.getRawValue());
    this.isLoading = true;
    let results: Observable<boolean>;
    if (this.editCinema) {
      // results = this.cinemaService.modifyCity(this.editCity.id, this.validateForm.getRawValue());
    } else {
      results = this.cinemaService.addCinema(this.validateForm.getRawValue());
    }
    results.subscribe(() => {
        this.isLoading = false;
        this.message.create('success', `${this.editCinema ? 'Updated' : 'Added'} successfully`);
      }
      , error => {
        this.isLoading = false;
        this.message.create('error', error.error.status + ', ' + error.error.error);
        console.log(error);
      });

  }

}
