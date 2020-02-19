import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireDatabaseModule, AngularFireDatabase } from "@angular/fire/database";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaPeliculasComponent } from './Components/lista-peliculas/lista-peliculas.component';
import { environment } from "../environments/environment";
import { FormModalAPComponent } from './Components/lista-peliculas/form-modal-ap/form-modal-ap.component';
import { LoginComponent } from './Components/login/login.component';
import { RegistroComponent } from './Components/registro/registro.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { FavoritosComponent } from './Components/favoritos/favoritos.component';
import { BuscarComponent } from './Components/buscar/buscar.component';

@NgModule({
  declarations: [
    AppComponent,
    ListaPeliculasComponent,
    FormModalAPComponent,
    LoginComponent,
    RegistroComponent,
    FavoritosComponent,
    BuscarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    AngularFireAuthModule
  ],
  providers: [ListaPeliculasComponent,BuscarComponent],
  bootstrap: [AppComponent],
  entryComponents: [
    FormModalAPComponent
  ]
})
export class AppModule { }
