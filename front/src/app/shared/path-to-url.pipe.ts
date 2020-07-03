import {Pipe, PipeTransform} from '@angular/core';
import {CinemaService} from '../Service/cinema.service';

@Pipe({
  name: 'pathToUrl'
})
export class PathToUrlPipe implements PipeTransform {
  constructor(private cinemaService: CinemaService) {
  }

  transform(value: string): string {
    return this.cinemaService.baseUrl + 'image-by-name/' + value;
  }

}
