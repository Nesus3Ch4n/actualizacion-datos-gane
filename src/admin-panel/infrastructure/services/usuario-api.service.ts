import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UsuarioDetalleCompletoDTO } from '../../application/dto/usuario-detalle-completo.dto';

@Injectable({ providedIn: 'root' })
export class UsuarioApiService {
  private readonly API_URL = 'http://localhost:8080/api/USUARIO/test/detalle-completo';

  constructor(private http: HttpClient) {}

  obtenerDetalleCompleto(idUsuario: number): Observable<UsuarioDetalleCompletoDTO> {
    console.log('=== SOLICITANDO DETALLE AL BACKEND ===');
    console.log('URL:', `${this.API_URL}/${idUsuario}`);
    console.log('ID Usuario:', idUsuario);
    
    return this.http.get<any>(`${this.API_URL}/${idUsuario}`).pipe(
      map(response => {
        console.log('=== RESPUESTA DEL BACKEND ===');
        console.log('Respuesta completa:', response);
        console.log('Datos extraídos:', response.data);
        console.log('================================');
        return response.data as UsuarioDetalleCompletoDTO;
      })
    );
  }
} 