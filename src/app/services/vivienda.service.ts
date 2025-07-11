import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViviendaService {
  private apiUrl = environment.apiBaseUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Guardar información de vivienda de un usuario específico
  guardarVivienda(cedula: number, vivienda: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formulario/vivienda/guardar?cedula=${cedula}`, vivienda, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar vivienda:', error);
          return throwError(() => new Error(`Error al guardar vivienda: ${error.message || error}`));
        })
      );
  }

  // Obtener información de vivienda de un usuario específico
  obtenerViviendaPorCedula(cedula: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/consulta/viviendas/${cedula}`)
      .pipe(
        catchError(error => {
          console.error('❌ Error al obtener vivienda:', error);
          return throwError(() => new Error(`Error al obtener vivienda: ${error.message || error}`));
        })
      );
  }
} 