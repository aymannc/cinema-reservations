import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import {NgZorroAntdModule, NzLayoutModule} from 'ng-zorro-antd';
import { TicketsComponent } from './Component/tickets/tickets.component';
import { BreadcrumbComponent } from './Component/breadcrumb/breadcrumb.component';
import { HomeComponent } from './Component/home/home.component';
import { MoviesComponent } from './Component/movies/movies.component';
import { CinemasComponent } from './Component/cinemas/cinemas.component';
import { CarouselComponent } from './Component/home/carousel/carousel.component';
import { ShortDescriptionPipe } from './Service/short-description.pipe';

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
    ShortDescriptionPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NgZorroAntdModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
