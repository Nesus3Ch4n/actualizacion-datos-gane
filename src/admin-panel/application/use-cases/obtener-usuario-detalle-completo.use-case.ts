import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioApiService } from '../../infrastructure/services/usuario-api.service';
import { UsuarioDetalleCompletoDTO } from '../dto/usuario-detalle-completo.dto';

@Injectable({ providedIn: 'root' })
export class ObtenerUsuarioDetalleCompletoUseCase {
  constructor(private usuarioApi: UsuarioApiService) {}

  execute(idUsuario: number): Observable<UsuarioDetalleCompletoDTO> {
    return this.usuarioApi.obtenerDetalleCompleto(idUsuario);
  }
} 