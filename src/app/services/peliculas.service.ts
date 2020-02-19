import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeliculaModel } from '../models/pelicula.model';
import { map, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  //private url = 'https://angular-firebase-68f73.firebaseio.com/';
  private url = 'https://proyectoangularionic.firebaseio.com/';
  user=localStorage.getItem('name');
pelicula:PeliculaModel;
  constructor( private http: HttpClient ) { }


  crearPelicula( pelicula: PeliculaModel ) {
    return this.http.post(`${ this.url }/peliculas.json`, pelicula)
            .pipe(
              map( (resp: any) => {
                pelicula.id = resp.name;
                return pelicula;
              })
            );

  }

  crearFavoritos( pelicula: PeliculaModel ) {
    this.user=localStorage.getItem('name');
    var nom = this.user.split("@");
    return this.http.post(`${ this.url }/${nom[0]}.json`, pelicula)
            .pipe(
              map( (resp: any) => {
                console.log("hola")
                pelicula.id = resp.name;
                return pelicula;
              })
            );

  }

  actualizarPelicula( pelicula: PeliculaModel ) {

    const peliculaTemp = {
      ...pelicula
    };

    delete peliculaTemp.id;

    return this.http.put(`${ this.url }/peliculas/${ pelicula.id }.json`, peliculaTemp);


  }

  borrarPelicula( id: string ) {

    return this.http.delete(`${ this.url }/peliculas/${ id }.json`);

  }

  borrarFav( id: string ) {
    this.user=localStorage.getItem('name');
    var nom = this.user.split("@");
    return this.http.delete(`${ this.url }/${nom[0]}/${id}.json`);

  }


  getPelicula( id: string ) {

    return this.http.get(`${ this.url }/peliculas/${ id }.json`);

  }


  getPeliculas() {
    return this.http.get(`${ this.url }/peliculas.json`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }
  getFavoritos() {
    this.user=localStorage.getItem('name');
    var nom = this.user.split("@");
    console.log(nom)
    return this.http.get(`${ this.url }/${nom[0]}.json`)
            .pipe(
              map( this.crearArreglo ),
              delay(0)
            );
  }

  private crearArreglo( peliculasObj: object ) {

    const peliculas: PeliculaModel[] = [];
    if(peliculasObj!=null){
    Object.keys( peliculasObj ).forEach( key => {

      const pelicula: PeliculaModel = peliculasObj[key];
      
      pelicula.id = key;
      
      peliculas.push( pelicula );
    });
  }

    return peliculas;

  }

  buscarPeliculas( termino:string, peliculas:PeliculaModel[]){

    let peliculasArr= [];
    termino = termino.toLowerCase();

    for( let i = 0; i < peliculas.length; i ++ ){

      this.pelicula = peliculas[i];

      let nombre = this.pelicula.titulo.toLowerCase();
      let gen = this.pelicula.genero.toLowerCase();

      if( nombre.indexOf( termino ) >= 0  ){
        peliculasArr.push( this.pelicula )
      }else if( gen.indexOf( termino ) >= 0  ){
        peliculasArr.push( this.pelicula )
      }

    }

    return peliculasArr;

  }


}
