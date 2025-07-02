import { BaseValueObject } from '../../../shared-kernel/common/base.value-object';

export class Departamento extends BaseValueObject<string> {
  private static readonly DEPARTAMENTOS_VALIDOS = [
    'Recursos Humanos',
    'Tecnología',
    'Finanzas',
    'Marketing',
    'Ventas',
    'Operaciones',
    'Legal',
    'Auditoría',
    'Compras',
    'Administración'
  ];

  private static readonly CONFIGURACIONES: { [key: string]: any } = {
    'Recursos Humanos': {
      codigo: 'RH',
      color: 'primary',
      icono: 'people',
      descripcion: 'Gestión del talento humano y relaciones laborales'
    },
    'Tecnología': {
      codigo: 'TI',
      color: 'accent',
      icono: 'computer',
      descripcion: 'Desarrollo de software y soporte técnico'
    },
    'Finanzas': {
      codigo: 'FIN',
      color: 'warn',
      icono: 'attach_money',
      descripcion: 'Gestión financiera y contable'
    },
    'Marketing': {
      codigo: 'MKT',
      color: 'primary',
      icono: 'campaign',
      descripcion: 'Estrategias de mercadeo y comunicación'
    },
    'Ventas': {
      codigo: 'VNT',
      color: 'accent',
      icono: 'trending_up',
      descripcion: 'Gestión comercial y ventas'
    },
    'Operaciones': {
      codigo: 'OPS',
      color: 'primary',
      icono: 'settings',
      descripcion: 'Operaciones y procesos empresariales'
    },
    'Legal': {
      codigo: 'LEG',
      color: 'warn',
      icono: 'gavel',
      descripcion: 'Asesoría jurídica y cumplimiento'
    },
    'Auditoría': {
      codigo: 'AUD',
      color: 'accent',
      icono: 'fact_check',
      descripcion: 'Control interno y auditoría'
    },
    'Compras': {
      codigo: 'COM',
      color: 'primary',
      icono: 'shopping_cart',
      descripcion: 'Adquisiciones y proveedores'
    },
    'Administración': {
      codigo: 'ADM',
      color: 'accent',
      icono: 'business_center',
      descripcion: 'Administración general'
    }
  };

  constructor(value: string) {
    super(value.trim());
  }

  protected validate(): void {
    this.validarDepartamento();
  }

  private validarDepartamento(): void {
    if (!this.value || this.value.length === 0) {
      throw new Error('El departamento no puede estar vacío');
    }

    if (!Departamento.DEPARTAMENTOS_VALIDOS.includes(this.value)) {
      throw new Error(`Departamento inválido: ${this.value}. Debe ser uno de: ${Departamento.DEPARTAMENTOS_VALIDOS.join(', ')}`);
    }
  }

  obtenerCodigo(): string {
    return Departamento.CONFIGURACIONES[this.value]?.codigo || 'UNKNOWN';
  }

  obtenerColor(): string {
    return Departamento.CONFIGURACIONES[this.value]?.color || 'primary';
  }

  obtenerIcono(): string {
    return Departamento.CONFIGURACIONES[this.value]?.icono || 'business';
  }

  obtenerDescripcion(): string {
    return Departamento.CONFIGURACIONES[this.value]?.descripcion || 'Departamento sin descripción';
  }

  esDepartamentoTecnico(): boolean {
    const departamentosTecnicos = ['Tecnología', 'Auditoría'];
    return departamentosTecnicos.includes(this.value);
  }

  esDepartamentoAdministrativo(): boolean {
    const departamentosAdministrativos = ['Recursos Humanos', 'Finanzas', 'Legal', 'Administración'];
    return departamentosAdministrativos.includes(this.value);
  }

  esDepartamentoComercial(): boolean {
    const departamentosComerciales = ['Ventas', 'Marketing'];
    return departamentosComerciales.includes(this.value);
  }

  esDepartamentoOperativo(): boolean {
    const departamentosOperativos = ['Operaciones', 'Compras'];
    return departamentosOperativos.includes(this.value);
  }

  puedeAccederInformacionFinanciera(): boolean {
    const departamentosAutorizados = ['Finanzas', 'Auditoría', 'Administración'];
    return departamentosAutorizados.includes(this.value);
  }

  puedeGestionarPersonal(): boolean {
    const departamentosAutorizados = ['Recursos Humanos', 'Administración'];
    return departamentosAutorizados.includes(this.value);
  }

  puedeVerReportesCompletos(): boolean {
    const departamentosAutorizados = ['Recursos Humanos', 'Auditoría', 'Administración'];
    return departamentosAutorizados.includes(this.value);
  }

  obtenerNivelAcceso(): 'alto' | 'medio' | 'bajo' {
    if (this.value === 'Administración') return 'alto';
    if (this.puedeVerReportesCompletos()) return 'medio';
    return 'bajo';
  }

  // Métodos para jerarquía organizacional
  esSubordinadoDe(otroDepartamento: Departamento): boolean {
    const jerarquia: { [key: string]: string[] } = {
      'Administración': [],
      'Recursos Humanos': ['Administración'],
      'Finanzas': ['Administración'],
      'Auditoría': ['Administración'],
      'Legal': ['Administración'],
      'Tecnología': ['Administración'],
      'Operaciones': ['Administración'],
      'Marketing': ['Operaciones'],
      'Ventas': ['Operaciones'],
      'Compras': ['Operaciones']
    };

    const superiores = jerarquia[this.value] || [];
    return superiores.includes(otroDepartamento.value);
  }

  esSuperiorDe(otroDepartamento: Departamento): boolean {
    return otroDepartamento.esSubordinadoDe(this);
  }

  // Métodos para búsqueda y filtrado
  coincideConBusqueda(termino: string): boolean {
    const terminoLimpio = termino.toLowerCase().trim();
    return this.value.toLowerCase().includes(terminoLimpio) ||
           this.obtenerCodigo().toLowerCase().includes(terminoLimpio) ||
           this.obtenerDescripcion().toLowerCase().includes(terminoLimpio);
  }

  // Métodos estáticos
  static obtenerDepartamentosValidos(): string[] {
    return [...Departamento.DEPARTAMENTOS_VALIDOS];
  }

  static obtenerConfiguraciones(): any {
    return { ...Departamento.CONFIGURACIONES };
  }

  static obtenerDepartamentosPorTipo(tipo: 'tecnico' | 'administrativo' | 'comercial' | 'operativo'): string[] {
    const departamentos = Departamento.DEPARTAMENTOS_VALIDOS.map(d => new Departamento(d));
    
    switch (tipo) {
      case 'tecnico':
        return departamentos.filter(d => d.esDepartamentoTecnico()).map(d => d.value);
      case 'administrativo':
        return departamentos.filter(d => d.esDepartamentoAdministrativo()).map(d => d.value);
      case 'comercial':
        return departamentos.filter(d => d.esDepartamentoComercial()).map(d => d.value);
      case 'operativo':
        return departamentos.filter(d => d.esDepartamentoOperativo()).map(d => d.value);
      default:
        return [];
    }
  }

  static validarDepartamento(departamento: string): boolean {
    try {
      new Departamento(departamento);
      return true;
    } catch {
      return false;
    }
  }

  static crearRecursosHumanos(): Departamento {
    return new Departamento('Recursos Humanos');
  }

  static crearTecnologia(): Departamento {
    return new Departamento('Tecnología');
  }

  static crearFinanzas(): Departamento {
    return new Departamento('Finanzas');
  }

  static crearAdministracion(): Departamento {
    return new Departamento('Administración');
  }

  // Conversión y comparación
  override toString(): string {
    return this.value;
  }

  toStringConCodigo(): string {
    return `${this.obtenerCodigo()} - ${this.value}`;
  }

  esIgualA(otroDepartamento: Departamento): boolean {
    return this.value === otroDepartamento.value;
  }
} 