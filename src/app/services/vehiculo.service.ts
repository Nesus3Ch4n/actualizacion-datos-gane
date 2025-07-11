import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private apiUrl = environment.apiBaseUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Guardar vehículos de un usuario específico
  guardarVehiculos(idUsuario: number, vehiculos: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formulario/vehiculos/guardar?idUsuario=${idUsuario}`, vehiculos, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar vehículos:', error);
          return throwError(() => new Error(`Error al guardar vehículos: ${error.message || error}`));
        })
      );
  }

  // Obtener vehículos de un usuario específico
  obtenerVehiculosPorCedula(cedula: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consulta/vehiculos/${cedula}`)
      .pipe(
        catchError(error => {
          console.error('❌ Error al obtener vehículos:', error);
          return throwError(() => new Error(`Error al obtener vehículos: ${error.message || error}`));
        })
      );
  }
} 