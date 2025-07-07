import { UsuarioDetalleCompletoDTO } from '../../application/dto/usuario-detalle-completo.dto';

export class UsuarioDetalleCompletoAdapter {
  static fromApi(data: any): UsuarioDetalleCompletoDTO {
    // Aquí podrías transformar los datos si es necesario
    return data as UsuarioDetalleCompletoDTO;
  }
} 