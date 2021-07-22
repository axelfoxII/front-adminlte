import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import {tap} from 'rxjs/operators'

// http://localhost:3000
const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  newUsuario(formData:RegisterForm){
    
    return this.http.post(`${URL}/usuarios`, formData, {responseType: 'text'}); 

  }

  login(formData:LoginForm){
      
    return this.http.post(`${URL}/auth/login`, formData).pipe(tap((res:any)=>{
      localStorage.setItem('token',res.token);
    })) 
  
  }

  get token():string{
    return localStorage.getItem('token');
  }

  obtenerUsuarios(){
    
    let headers = new HttpHeaders({
      'token': localStorage.getItem('token')
    });

  return this.http.get(`${URL}/usuarios`,{headers}); 

  }

  deleteUsuario(id:string){
    
    let headers = new HttpHeaders({
      'token': this.token
    });

    return this.http.delete(`${URL}/usuarios/${id}`, {headers}); 

  }

}
