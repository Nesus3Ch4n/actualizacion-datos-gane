export interface ActualizarInformacionPersonalDto {
  numeroDocumento: string;
  nombreCompleto: string;
  fechaNacimiento: string; // ISO string
  ciudadExpedicionCedula: string;
  paisNacimiento: string;
  ciudadNacimiento: string;
  cargo: string;
  area: string;
  estadoCivil: string;
  tipoSangre: string;
} 