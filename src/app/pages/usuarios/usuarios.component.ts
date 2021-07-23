import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {Usuario} from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit,OnDestroy {
  
  dtOptions: DataTables.Settings = {};
  usuarios:Usuario[]=[];
  dtTrigger: Subject<any> = new Subject<any>();

  formSubmitted = false;
  Roles: any = ['admin', 'editor'];

  public registerForm = this.fb.group({
  
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    password2: ['', [Validators.required]],
    role: ['', [Validators.required]]
  },{
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(private usuarioSvc: UsuarioService, private fb:FormBuilder, private router:Router) { }

  ngOnInit(): void {
    
    this.obtenerUsuario();
    this.dtOptions = {
    
      pageLength: 10,
      searching: true,
      responsive:true,
      info:true,
      language: {url:'//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'}
    };

  }

  obtenerUsuario(){
  
    this.usuarioSvc.obtenerUsuarios().subscribe((res:any) =>{    
     this.usuarios =res;
     this.dtTrigger.next();

    });

  }

  crearUsuarios(){
    this.formSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    //Realizar posteo
    this.usuarioSvc.newUsuario(this.registerForm.value).subscribe(res=>{
      Swal.fire({
        icon:'success',
        title:'Exito',
        text:'Usuario creado correctamente',
        showConfirmButton: true
      }).then((result)=>{

        location.reload();

      });
    }, (err)=>{
      
      const errorServer = JSON.parse(err.error);

      Swal.fire('Error', errorServer.message, 'error');

    })

  }

  eliminarUsuario(id:string){
   
    if (id == localStorage.getItem('usuarioId')) {
      Swal.fire('Error', 'No puede eliminar un usuario activo', 'error');
    }else{
    
    Swal.fire({
      icon:'question',
      title:'Desea eliminar este usuario?',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then((result)=>{
        if (result.isConfirmed) {
          this.usuarioSvc.deleteUsuario(id).subscribe((res:any)=>{
            
            Swal.fire({
              icon:'success',
              title:'Usuario eliminado correctamente',
              confirmButtonText:'Ok'            
            }).then((result)=>{
                
              if (result) {
                location.reload();
              }
  
            });
  
          })
          
        }      

    });
  } 

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  get roles(){

    return this.registerForm.get('role');

  }

  changeRole(evento){
    
    console.log(evento.target.value);

    this.roles.setValue(evento.target.value, {
      onlySelf: true
    })

  }

  campoNoValido(campo:string): boolean{
    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    }else{
      return false;
    }
  }

  constrasenasNoValidas(){

    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    }else{
      return false;
    }

  }

  passwordsIguales(pass1Name: string, pass2Name:string){

    return (formGroup: FormGroup) =>{
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({noEsIgual:true});
      }

    }

  }

}
