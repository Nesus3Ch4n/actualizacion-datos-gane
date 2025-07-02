import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViviendaService {
  private apiUrl = 'http://localhost:8080/api/vivienda';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Guardar información de vivienda de un usuario específico
  guardarVivienda(idUsuario: number, vivienda: any): Observable<any> {
    console.log(`🏠 Guardando información de vivienda para usuario ID: ${idUsuario}`);
    
    return this.http.post<any>(`${this.apiUrl}/usuario/${idUsuario}`, vivienda, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar vivienda:', error);
          return throwError(() => new Error(`Error al guardar vivienda: ${error.message || error}`));
        })
      );
  }

  // Obtener información de vivienda de un usuario específico
  obtenerViviendaPorUsuario(idUsuario: number): Observable<any> {
    console.log(`📋 Obteniendo información de vivienda para usuario ID: ${idUsuario}`);
    
    return this.http.get<any>(`${this.apiUrl}/usuario/${idUsuario}`)
      .pipe(
        catchError(error => {
          console.error('❌ Error al obtener vivienda:', error);
          return throwError(() => new Error(`Error al obtener vivienda: ${error.message || error}`));
        })
      );
  }
} 