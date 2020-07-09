import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {NgZorroAntdModule, NzLayoutModule} from 'ng-zorro-antd';
import {TicketsComponent} from './Component/tickets/tickets.component';
import {BreadcrumbComponent} from './Component/breadcrumb/breadcrumb.component';
import {HomeComponent} from './Component/home/home.component';
import {MoviesComponent} from './Component/movies/movies.component';
import {CinemasComponent} from './Component/cinemas/cinemas.component';
import {CarouselComponent} from './Component/home/carousel/carousel.component';
import {ShortDescriptionPipe} from './Service/short-description.pipe';
import {PathToUrlPipe} from './shared/path-to-url.pipe';
import { AddMovieComponent } from './Component/movies/add-movie/add-movie.component';
import { MovieDetailsComponent } from './Component/movies/movie-details/movie-details.component';
import { AddCityComponent } from './Component/cinemas/add-city/add-city.component';
import { CinemaFormComponent } from './Component/cinemas/cinema-form/cinema-form.component';
import { EditRoomComponent } from './Component/cinemas/edit-room/edit-room.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    TicketsComponent,
    BreadcrumbComponent,
    HomeComponent,
    MoviesComponent,
    CinemasComponent,
    CarouselComponent,
    ShortDescriptionPipe,
    PathToUrlPipe,
    AddMovieComponent,
    MovieDetailsComponent,
    AddCityComponent,
    CinemaFormComponent,
    EditRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
