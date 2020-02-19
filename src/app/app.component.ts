import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router,ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProyectoPeliculasAngular';
  navbar=localStorage.getItem('navbar')
  fondo=localStorage.getItem('fondo')
  user=localStorage.getItem('name');
  constructor(private router:Router,private auth:AuthService){
    router.events.subscribe(resp => this.user=localStorage.getItem('name'))

  }
  ngOnInit() {
    this.router.events.subscribe((val) => {
      // see also 
      if(val instanceof ActivationEnd){
        if(this.router.url=="/login" || this.router.url=="/registro"){
            this.fondo="null";
            this.navbar="null";
        }else{
          this.fondo="true";
          this.navbar="true";
        }
      } 
  });
    }
  buscarPelicula( termino:string ){
    // console.log(termino);
    if(termino!=""){
    this.router.navigate( ['/buscar',termino] );
    }else{
    this.router.navigateByUrl('/peliculas');
    }
  }
  irFavs(){
    this.router.navigateByUrl('/favoritos/'+this.user);
  }
  salir() {
    this.auth.logout();
    
    this.router.navigateByUrl('/login');

  }
}
