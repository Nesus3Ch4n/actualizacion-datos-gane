import { BaseValueObject } from '../../../shared-kernel/common/base.value-object';

export class TipoReporte extends BaseValueObject<string> {
  private static readonly TIPOS_VALIDOS = [
    'integrantes',
    'conflicto-intereses', 
    'estudios',
    'contacto',
    'personas-cargo',
    'completo'
  ];

  private static readonly CONFIGURACIONES: { [key: string]: any } = {
    'integrantes': {
      nombre: 'Reporte de Integrantes',
      descripcion: 'Listado completo de todos los empleados con información básica',
      icono: 'group',
      color: 'primary',
      columnas: ['ID', 'Nombre', 'Apellido', 'Email', 'Cargo', 'Departamento', 'Fecha Ingreso', 'Estado']
    },
    'conflicto-intereses': {
      nombre: 'Reporte Conflicto de Intereses',
      descripcion: 'Empleados con declaraciones de conflicto de intereses',
      icono: 'warning',
      color: 'warn',
      columnas: ['ID', 'Nombre', 'Apellido', 'Email', 'Cargo', 'Departamento', 'Conflicto de Intereses', 'Última Actualización']
    },
    'estudios': {
      nombre: 'Reporte de Estudios',
      descripcion: 'Información académica y formación de los empleados',
      icono: 'school',
      color: 'accent',
      columnas: ['ID', 'Nombre', 'Apellido', 'Nivel Educativo', 'Institución', 'Título', 'Año Graduación']
    },
    'contacto': {
      nombre: 'Reporte Personas de Contacto',
      descripcion: 'Información de contacto y personas de emergencia',
      icono: 'contact_phone',
      color: 'primary',
      columnas: ['ID', 'Nombre', 'Apellido', 'Teléfono', 'Email', 'Dirección', 'Contacto Emergencia', 'Parentesco']
    },
    'personas-cargo': {
      nombre: 'Reporte Personas a Cargo',
      descripcion: 'Empleados con personas dependientes a su cargo',
      icono: 'family_restroom',
      color: 'accent',
      columnas: ['ID', 'Nombre', 'Apellido', 'Tiene Personas a Cargo', 'Número de Personas', 'Parentesco', 'Edades']
    },
    'completo': {
      nombre: 'Reporte Completo',
      descripcion: 'Información completa de todos los empleados',
      icono: 'description',
      color: 'primary',
      columnas: ['ID', 'Nombre', 'Apellido', 'Email', 'Cargo', 'Departamento', 'Fecha Ingreso', 'Estado', 'Conflicto Intereses', 'Última Actualización']
    }
  };

  constructor(value: string) {
    super(value);
  }

  protected validate(): void {
    if (!TipoReporte.TIPOS_VALIDOS.includes(this.value)) {
      throw new Error(`Tipo de reporte inválido: ${this.value}. Debe ser uno de: ${TipoReporte.TIPOS_VALIDOS.join(', ')}`);
    }
  }

  obtenerNombre(): string {
    return TipoReporte.CONFIGURACIONES[this.value]?.nombre || 'Reporte Desconocido';
  }

  obtenerDescripcion(): string {
    return TipoReporte.CONFIGURACIONES[this.value]?.descripcion || 'Descripción no disponible';
  }

  obtenerIcono(): string {
    return TipoReporte.CONFIGURACIONES[this.value]?.icono || 'description';
  }

  obtenerColor(): string {
    return TipoReporte.CONFIGURACIONES[this.value]?.color || 'primary';
  }

  obtenerColumnas(): string[] {
    return TipoReporte.CONFIGURACIONES[this.value]?.columnas || [];
  }

  obtenerNombreArchivo(): string {
    const nombres: { [key: string]: string } = {
      'integrantes': 'reporte_integrantes',
      'conflicto-intereses': 'reporte_conflicto_intereses',
      'estudios': 'reporte_estudios', 
      'contacto': 'reporte_contacto',
      'personas-cargo': 'reporte_personas_cargo',
      'completo': 'reporte_completo'
    };
    return nombres[this.value] || 'reporte';
  }

  esReporteCompleto(): boolean {
    return this.value === 'completo';
  }

  esReporteEspecifico(): boolean {
    return this.value !== 'completo';
  }

  requiereFiltroEspecial(): boolean {
    return this.value === 'conflicto-intereses' || this.value === 'personas-cargo';
  }

  obtenerFiltroEspecial(): any {
    switch (this.value) {
      case 'conflicto-intereses':
        return { tieneConflictoIntereses: true };
      case 'personas-cargo':
        return { tienePersonasACargo: true };
      default:
        return {};
    }
  }

  // Métodos estáticos
  static obtenerTiposValidos(): string[] {
    return [...TipoReporte.TIPOS_VALIDOS];
  }

  static obtenerConfiguraciones(): any {
    return { ...TipoReporte.CONFIGURACIONES };
  }

  static crearIntegrantes(): TipoReporte {
    return new TipoReporte('integrantes');
  }

  static crearConflictoIntereses(): TipoReporte {
    return new TipoReporte('conflicto-intereses');
  }

  static crearEstudios(): TipoReporte {
    return new TipoReporte('estudios');
  }

  static crearContacto(): TipoReporte {
    return new TipoReporte('contacto');
  }

  static crearPersonasCargo(): TipoReporte {
    return new TipoReporte('personas-cargo');
  }

  static crearCompleto(): TipoReporte {
    return new TipoReporte('completo');
  }

  // Validaciones de negocio
  puedeGenerarseSinFiltros(): boolean {
    return this.value === 'integrantes' || this.value === 'completo';
  }

  requiereValidacionEspecial(): boolean {
    return this.value === 'conflicto-intereses';
  }

  obtenerEstimacionTiempo(): string {
    const estimaciones: { [key: string]: string } = {
      'integrantes': '1-2 minutos',
      'conflicto-intereses': '30 segundos',
      'estudios': '2-3 minutos',
      'contacto': '1-2 minutos',
      'personas-cargo': '1 minuto',
      'completo': '3-5 minutos'
    };
    return estimaciones[this.value] || '1-2 minutos';
  }
} 