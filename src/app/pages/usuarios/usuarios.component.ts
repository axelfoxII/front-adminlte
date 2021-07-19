import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import {Usuario} from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

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

  constructor(private usuarioSvc: UsuarioService) { }

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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
