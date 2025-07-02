import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private apiUrl = 'http://localhost:8080/api/vehiculos';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Guardar vehículos de un usuario específico
  guardarVehiculos(idUsuario: number, vehiculos: any[]): Observable<any> {
    console.log(`🚗 Guardando ${vehiculos.length} vehículos para usuario ID: ${idUsuario}`);
    
    return this.http.post<any>(`${this.apiUrl}/usuario/${idUsuario}`, vehiculos, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar vehículos:', error);
          return throwError(() => new Error(`Error al guardar vehículos: ${error.message || error}`));
        })
      );
  }

  // Obtener vehículos de un usuario específico
  obtenerVehiculosPorUsuario(idUsuario: number): Observable<any[]> {
    console.log(`📋 Obteniendo vehículos para usuario ID: ${idUsuario}`);
    
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`)
      .pipe(
        catchError(error => {
          console.error('❌ Error al obtener vehículos:', error);
          return throwError(() => new Error(`Error al obtener vehículos: ${error.message || error}`));
        })
      );
  }
} 