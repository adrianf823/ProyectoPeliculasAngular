import { Component, Output, EventEmitter, Input,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from '@angular/fire/storage';
import { ListaPeliculasComponent } from 'src/app/Components/lista-peliculas/lista-peliculas.component';
import { finalize } from "rxjs/operators";
import { PeliculasService } from 'src/app/Services/peliculas.service';
import { PeliculaModel } from 'src/app/models/pelicula.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal-ap.component.html'
})
export class FormModalAPComponent {
  @Input() public modif=false; 
  @Input() public peliculam: PeliculaModel;
  myForm: FormGroup;
  filePath;
  pelicula: PeliculaModel = new PeliculaModel();
  Imgsrc='/assets/img/image-placeholder.jpg';
  Imgpreview:any = null;
  isSubmitted:boolean=false;
  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: FormBuilder,
   private storage: AngularFireStorage,
   private service: PeliculasService,
   public lp: ListaPeliculasComponent
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.modif)
    if(this.modif==true){
      this.idm.setValue(this.peliculam.id, {
        onlySelf: true
      })
    this.port.setValue(this.peliculam.portada, {
      onlySelf: true
    })
    if(this.peliculam.portada!=null){
    this.Imgsrc=this.peliculam.portada
    }
    console.log(this.port)
    this.titul.setValue(this.peliculam.titulo, {
      onlySelf: true
    })
    this.descrip.setValue(this.peliculam.descripcion, {
      onlySelf: true
    })
    this.generon.setValue(this.peliculam.genero, {
      onlySelf: true
    })
  }
  }
  private createForm() {
    this.myForm = this.formBuilder.group({
      id:'',
      portada:'',
      titulo: ['', [Validators.required]],
      descripcion:'',
      genero:['', [Validators.required]]
    });
  }
  private submitForm(formValue) {
    this.isSubmitted=true
if(this.myForm.valid){
  console.log(this.Imgpreview)
  if(this.Imgpreview==null && this.modif == false){
    Swal.fire({
      text:'Tienes que añadir una portada',
      icon: 'warning'
    })
  }else{
    if(this.modif==false){
      Swal.fire({
        title: 'Espere',
        text: 'Subiendo película...',
        icon: 'info',
        allowOutsideClick: false
      });
      Swal.showLoading();
    this.filePath = `${formValue.genero}/${this.Imgpreview.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(this.filePath);
    this.storage.upload(this.filePath, this.Imgpreview).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          formValue['portada'] = url;
          this.pelicula=formValue;
  this.service.crearPelicula(this.pelicula).subscribe( resp => {
            this.resetForm();
            this.activeModal.close(this.myForm.value);
          })
  
        })
      })
    ).subscribe();
  }else{
    Swal.fire({
      title: 'Espere',
      text: 'Actualizando película...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    if(this.Imgpreview==null){
      console.log(this.peliculam)
      this.service.actualizarPelicula(this.myForm.value).subscribe( resp => {
        this.resetForm();
        this.modif=false;
        this.activeModal.close(this.myForm.value);
      })
    }else{
    this.filePath = `${formValue.genero}/${this.Imgpreview.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(this.filePath);
    this.storage.upload(this.filePath, this.Imgpreview).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          formValue['portada'] = url;
          this.peliculam=formValue;
          console.log(this.peliculam)
          this.service.actualizarPelicula(this.myForm.value).subscribe( resp => {
            this.resetForm();
            this.modif=false;
            this.activeModal.close(this.myForm.value);
          })
  
        })
      })
    ).subscribe();
    }
  }
}
}else{
    
}
  }
  get generon() {
    return this.myForm.get('genero');
  }
  get port() {
    return this.myForm.get('portada');
  }
  get descrip() {
    return this.myForm.get('descripcion');
  }
  get titul() {
    return this.myForm.get('titulo');
  }
  get idm() {
    return this.myForm.get('id');
  }
  cambiarGenero(e) {
    this.generon.setValue(e.target.value, {
      onlySelf: true
    })
  }
  cambiaPreview(event:any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader;
      reader.onload = (e:any) => {
        this.Imgsrc=e.target.result
      }
      reader.readAsDataURL(event.target.files[0])
      this.Imgpreview=event.target.files[0]
    }else{
      this.Imgsrc='/assets/img/image-placeholder.jpg'
      this.Imgpreview=null;
      this.port.setValue(this.Imgsrc, {
        onlySelf: true
      })
    }
  }
  cambiarPortada(e){
    console.log(e.target.value)
    this.port.setValue(e.target.value, {
      onlySelf: true
    })
  }
  get formControls(){
    return this.myForm['controls'];
  }
  resetForm() {
    this.myForm.reset();
    this.Imgsrc = '/assets/img/image_placeholder.jpg';
    this.Imgpreview = null;
    this.isSubmitted = false;
  }
}