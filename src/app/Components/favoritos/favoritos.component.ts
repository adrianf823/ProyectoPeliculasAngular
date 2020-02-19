import { Component, OnInit } from '@angular/core';
import { PeliculasService } from 'src/app/Services/peliculas.service';
import { AuthService } from 'src/app/services/auth.service';
import { PeliculaModel } from 'src/app/models/pelicula.model';
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import { auth } from 'firebase';
@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit {
favoritos:PeliculaModel[]=[]
cargando:boolean=true
  constructor(private service: PeliculasService, private router: Router ,private auth:AuthService) { }

  ngOnInit() {
    console.log(this.cargando)
    this.service.getFavoritos()
    .subscribe( resp => {
      this.favoritos = resp;
      this.cargando=false;
    });
  }
  volver(){
    this.router.navigateByUrl("/peliculas")
  }

  eliminarFav( pelicula: PeliculaModel, i: number ){
    Swal.fire({
      title: `¿Quitar a "${pelicula.titulo}" de favoritos?`,
      text: 'No podrás volver atrás!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.favoritos.splice(i, 1);
        this.service.borrarFav(pelicula.id).subscribe()
        Swal.fire({
          text:'Pelicula eliminada de favoritos con exito',
          icon: 'success',
          timer: 2000
        })
      }
    })
    this.service.getFavoritos()
    .subscribe( resp => {
      this.favoritos = resp;
    });
  }
  buscarPelicula( termino:string ){
    // console.log(termino);

    this.router.navigate( ['/buscar',termino] );
    
  }
}
