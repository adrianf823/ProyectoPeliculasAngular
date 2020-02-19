import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModalAPComponent } from 'src/app/Components/lista-peliculas/form-modal-ap/form-modal-ap.component';
import { PeliculasService } from 'src/app/Services/peliculas.service';
import { PeliculaModel } from 'src/app/models/pelicula.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
 
@Component({
  selector: 'app-lista-peliculas',
  templateUrl: './lista-peliculas.component.html',
  styleUrls: ['./lista-peliculas.component.scss']
})
export class ListaPeliculasComponent implements OnInit {
  cargando:boolean=true;
peliculas: PeliculaModel[] = [];
modif:boolean=false
  constructor(private modalService: NgbModal,private service:PeliculasService, private auth: AuthService,
    private router: Router,private storageRef:AngularFireStorage ) { 
localStorage.setItem('navbar',"true")
localStorage.setItem('fondo',"true")
  }

  ngOnInit() {
    this.service.getPeliculas()
    .subscribe( resp => {
      this.peliculas = resp;
      this.cargando=false;
      localStorage.setItem("peliculas", JSON.stringify(this.peliculas));
    });
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
      this.service.borrarPelicula(pelicula.id).subscribe()
      this.storageRef.storage.refFromURL(pelicula.portada).delete()
      Swal.fire({
        text:'Pelicula eliminada con exito',
        icon: 'success',
        timer: 2000
      })
    })

      localStorage.setItem("peliculas", JSON.stringify(this.peliculas));
    }
  })
  this.service.getPeliculas()
  .subscribe( resp => {
    this.peliculas = resp;
  });
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
    });
    localStorage.setItem("peliculas", JSON.stringify(this.peliculas));
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
      
    });
  }).catch((error) => {
    console.log(error);
  });

}

buscarPelicula( termino:string ){
  // console.log(termino);
  localStorage.setItem('filtro',termino)
  if(termino=="Todos"){
    this.router.navigateByUrl( '/peliculas' );
  }else{
  this.router.navigate( ['/buscar',termino] );
  }

}

}
