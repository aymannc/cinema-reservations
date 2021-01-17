import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CinemaService} from '../../../Service/cinema.service';
import {Observable} from 'rxjs';
import {City} from '../../../Data/City';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
})
export class AddCityComponent implements OnInit, OnChanges {
  validateForm: FormGroup;
  isLoading: boolean;
  @Input() editCity: { id: number; city: string; cinemas: string };

  constructor(private fb: FormBuilder, private message: NzMessageService,
              private cinemaService: CinemaService) {
  }

  ngOnChanges() {
    if (this.editCity != null) {
      this.cinemaService.getCity(this.editCity.id).subscribe(city => {
        this.validateForm.get('name').setValue(city.name);
        this.validateForm.get('altitude').setValue(city.altitude);
        this.validateForm.get('longitude').setValue(city.longitude);
        this.validateForm.get('latitude').setValue(city.latitude);
      });
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      altitude: [null],
      longitude: [null],
      latitude: [null],
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm) {
      this.callApi();
    }
  }

  private callApi() {
    this.isLoading = true;
    let results: Observable<City>;
    if (this.editCity) {
      results = this.cinemaService.modifyCity(this.editCity.id, this.validateForm.getRawValue());
    } else {
      results = this.cinemaService.addCity(this.validateForm.getRawValue());
    }
    results.subscribe((_: City) => {
        this.isLoading = false;
        this.message.create('success', `${this.editCity ? 'Updated' : 'Added'} successfully`);
      }
      , error => {
        this.isLoading = false;
        this.message.create('error', error.error.status + ', ' + error.error.error);
        console.log(error);
      });

  }
}
