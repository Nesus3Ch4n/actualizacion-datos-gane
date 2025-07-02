export interface EmpleadoDto {
  numeroDocumento: string;
  informacionPersonal?: InformacionPersonalDto;
  informacionContacto?: InformacionContactoDto;
  informacionVivienda?: InformacionViviendaDto;
  informacionVehiculo?: InformacionVehiculoDto;
  informacionAcademica?: InformacionAcademicaDto;
  personasACargo: PersonaACargoDto[];
  estaCompleto: boolean;
}

export interface InformacionPersonalDto {
  nombreCompleto: string;
  fechaNacimiento: string;
  ciudadExpedicionCedula: string;
  paisNacimiento: string;
  ciudadNacimiento: string;
  cargo: string;
  area: string;
  estadoCivil: string;
  tipoSangre: string;
  edad: number;
}

export interface InformacionContactoDto {
  telefonoCelular: string;
  correoPersonal: string;
  telefonoFijo?: string;
  telefonoCorporativo?: string;
  contactosEmergencia: ContactoEmergenciaDto[];
}

export interface ContactoEmergenciaDto {
  nombre: string;
  parentesco: string;
  telefono: string;
}

export interface InformacionViviendaDto {
  direccion: DireccionDto;
  tipoVivienda: string;
  tipoAdquisicion: string;
  valorVivienda?: number;
  fechaAdquisicion?: string;
}

export interface DireccionDto {
  calle: string;
  numero: string;
  complemento: string;
  barrio: string;
  ciudad: string;
  departamento: string;
}

export interface InformacionVehiculoDto {
  tieneVehiculo: boolean;
  tipoVehiculo?: string;
  marca?: string;
  placa?: string;
  año?: number;
  propietario?: string;
}

export interface InformacionAcademicaDto {
  estaEstudiando: boolean;
  estudios: EstudioAcademicoDto[];
}

export interface EstudioAcademicoDto {
  nivelEducativo: string;
  titulo: string;
  institucion: string;
  fechaInicio: string;
  fechaGraduacion?: string;
  enCurso: boolean;
}

export interface PersonaACargoDto {
  numeroDocumento: string;
  nombreCompleto: string;
  parentesco: string;
  fechaNacimiento: string;
  edad: number;
  esDependienteEconomico: boolean;
} 