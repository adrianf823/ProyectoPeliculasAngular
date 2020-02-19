import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeliculasService } from 'src/app/Services/peliculas.service';
import { PeliculaModel } from 'src/app/models/pelicula.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModalAPComponent } from 'src/app/Components/lista-peliculas/form-modal-ap/form-modal-ap.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})
export class BuscarComponent implements OnInit {
  peliculas:PeliculaModel[]
  pelicula:PeliculaModel;
  termino:string;
  filtro=localStorage.getItem('filtro');
  constructor(private activatedRoute: ActivatedRoute, private router: Router ,private service:PeliculasService,private storageRef:AngularFireStorage,private modalService: NgbModal) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe( params =>{
      this.termino =params['termino'];
      this.peliculas=JSON.parse(localStorage.getItem("peliculas"));
      this.peliculas = this.service.buscarPeliculas( params['termino'],this.peliculas);
      console.log(this.peliculas)
    })
  }
  buscarPelicula( termino:string ){
    // console.log(termino);
    this.filtro=termino;
    if(termino=="Todos"){
      this.router.navigateByUrl( '/peliculas' );
    }else{
    this.router.navigate( ['/buscar',termino] );
    }
  }
  anadirFav(pelicula: PeliculaModel){
    var arrayfavs,entra=0;
    this.service.getFavoritos().subscribe(resp=>{
      arrayfavs=resp;
      for (let index = 0; index < arrayfavs.length; index++) {
  
        var pel=arrayfavs[index]
        var titulo=pel.titulo.toLowerCase()
        if( titulo.indexOf(pelicula.titulo.toLowerCase()) >= 0 ){
          Swal.fire({
            text:`"${pelicula.titulo}" ya está en favoritos`,
            icon: 'error',
            timer: 4000
          })
          entra=1;
          break;
          }
  
      }
      if(entra==0){
        this.service.crearFavoritos(pelicula).subscribe( resp => {
          Swal.fire({
            text:'Añadido a favoritos con exito',
            icon: 'success',
            timer: 2000
          })
        })
      }
    });
  
  
  }
  eliminarPelicula( pelicula: PeliculaModel, i: number ){
    Swal.fire({
      title: `¿Estás seguro? ${ pelicula.titulo }`,
      text: 'No podrás volver atrás!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
       this.service.getFavoritos().subscribe(resp=>{
        var arrayfavs=resp;
        for (let index = 0; index < arrayfavs.length; index++) {
    
          var pel=arrayfavs[index]
          var titulo=pel.titulo.toLowerCase()
          if( titulo.indexOf(pelicula.titulo.toLowerCase()) >= 0 ){
            this.service.borrarFav(pel.id).subscribe()
            break;
            }
        }
        this.peliculas.splice(i, 1);
        this.service.borrarPelicula(pelicula.id).subscribe(resp=>{
          this.storageRef.storage.refFromURL(pelicula.portada).delete()
          Swal.fire({
            text:'Pelicula eliminada con exito',
            icon: 'success',
            timer: 2000
          })
          this.router.navigateByUrl("/peliculas")
        })
      })
  
        localStorage.setItem("peliculas", JSON.stringify(this.peliculas));
        this.service.getPeliculas()
        .subscribe( resp => {
          this.peliculas = resp;
        });
      }
    })
  }
  modificarPelicula(pelicula: PeliculaModel,i:number){
  const modalRef = this.modalService.open(FormModalAPComponent);
    modalRef.componentInstance.modif = true;
    modalRef.componentInstance.peliculam=pelicula
    modalRef.result.then((result) => {
      Swal.fire({
        text:'Película modificada con exito',
        icon: 'success',
        timer: 2000
      })
      this.service.getPeliculas()
      .subscribe( resp => {
        this.peliculas = resp;
        localStorage.setItem("peliculas", JSON.stringify(this.peliculas));
        this.router.navigateByUrl("/peliculas")
      });
      
    }).catch((error) => {
      console.log(error);
    });
  }
  anadirPelicula() {
    const modalRef = this.modalService.open(FormModalAPComponent);
    
    modalRef.result.then((result) => {
      Swal.fire({
        text:'Película añadida con exito',
        icon: 'success',
        timer: 2000
      })
      console.log(result)
      this.service.getPeliculas()
      .subscribe( resp => {
        this.peliculas = resp;
        localStorage.setItem("peliculas", JSON.stringify(this.peliculas));
        this.router.navigateByUrl("/peliculas")
      });
    }).catch((error) => {
      console.log(error);
    });
  
  }
}
