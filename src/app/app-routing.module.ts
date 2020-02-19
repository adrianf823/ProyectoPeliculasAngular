import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroComponent } from './Components/registro/registro.component';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ListaPeliculasComponent } from './Components/lista-peliculas/lista-peliculas.component';
import { FavoritosComponent } from './Components/favoritos/favoritos.component';
import { BuscarComponent } from './Components/buscar/buscar.component';

const routes: Routes = [
  { path: 'peliculas'    , component: ListaPeliculasComponent, canActivate: [ AuthGuard ] },
  { path: 'registro', component: RegistroComponent },
  { path: 'favoritos/:email', component: FavoritosComponent },
  { path: 'buscar/:termino', component: BuscarComponent },
  { path: 'login'   , component: LoginComponent },
  { path: '**', redirectTo: 'registro' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
