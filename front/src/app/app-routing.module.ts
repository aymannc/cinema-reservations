import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './Component/home/home.component';
import {MoviesComponent} from './Component/movies/movies.component';
import {CinemasComponent} from './Component/cinemas/cinemas.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent,
  },
  {
    path: 'movies', component: MoviesComponent,
    children: []
  },
  {
    path: 'cinemas', component: CinemasComponent,
    children: []
  }
  ,
  {
    path: '**', redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
