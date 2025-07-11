import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {
  constructor() {}

  /**
   * Método de prueba para verificar que el servicio funciona
   */
  testExcelGeneration(): void {
    const testData = [
      { 'Columna 1': 'Dato 1', 'Columna 2': 'Dato 2', 'Columna 3': 'Dato 3' },
      { 'Columna 1': 'Dato 4', 'Columna 2': 'Dato 5', 'Columna 3': 'Dato 6' }
    ];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(testData);
    XLSX.utils.book_append_sheet(wb, ws, 'Prueba');
    
    const nombreArchivo = `test_excel_${new Date().toISOString().split('T')[0]}.xlsx`;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), nombreArchivo);
  }

  /**
   * Exporta auditorías agrupadas por fecha
   */
  exportAuditoriasPorFecha(auditorias: any[]): void {
    if (!auditorias || auditorias.length === 0) {
      throw new Error('No hay auditorías para exportar');
    }

    // Agrupar por fecha (YYYY-MM-DD)
    const agrupadas: { [fecha: string]: any[] } = {};
    auditorias.forEach(aud => {
      const fecha = aud.fecha ? aud.fecha.split('T')[0] : 'Sin fecha';
      if (!agrupadas[fecha]) agrupadas[fecha] = [];
      agrupadas[fecha].push(aud);
    });

    // Crear hojas por cada fecha
    const wb = XLSX.utils.book_new();
    
    // Hoja de resumen
    const resumenData = this.crearResumenAuditorias(auditorias);
    const wsResumen = XLSX.utils.json_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

    // Hojas por fecha
    Object.keys(agrupadas).sort().forEach(fecha => {
      const data = agrupadas[fecha].map(aud => ({
        'ID Auditoría': aud.idAuditoria,
        'Tabla Modificada': aud.tablaModificada,
        'ID Registro': aud.idRegistroModificado,
        'Campo Modificado': aud.campoModificado,
        'Valor Anterior': aud.valorAnterior,
        'Valor Nuevo': aud.valorNuevo,
        'Tipo Petición': aud.tipoPeticion,
        'Usuario Modificador': aud.usuarioModificador,
        'ID Usuario': aud.idUsuario,
        'Descripción': aud.descripcion,
        'IP Address': aud.ipAddress,
        'User Agent': aud.userAgent,
        'Fecha Completa': aud.fecha
      }));
      
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, fecha);
    });

    const nombreArchivo = `auditorias_${new Date().toISOString().split('T')[0]}.xlsx`;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), nombreArchivo);
  }

  /**
   * Exporta usuarios con todos sus detalles relacionados
   */
  exportUsuariosConDetalles(usuarios: any[]): void {
    if (!usuarios || usuarios.length === 0) {
      throw new Error('No hay usuarios para exportar');
    }

    const wb = XLSX.utils.book_new();

    // Hoja principal: Usuarios
    const usuariosSheet = usuarios.map(u => ({
      'ID Usuario': u.idUsuario || u.id,
      'Nombre': u.nombre,
      'Apellido': u.apellido,
      'Correo': u.correo || u.email,
      'Documento': u.documento,
      'Departamento': u.departamento,
      'Cargo': u.cargo,
      'Estado': u.estado,
      'Fecha Registro': u.fechaRegistro,
      'Conflicto Intereses': u.tieneConflictoIntereses ? 'Sí' : 'No'
    }));
    
    const wsUsuarios = XLSX.utils.json_to_sheet(usuariosSheet);
    XLSX.utils.book_append_sheet(wb, wsUsuarios, 'Usuarios');

    // Hojas de detalles relacionados
    const detalles = [
      { key: 'contactosEmergencia', nombre: 'Contactos Emergencia' },
      { key: 'estudiosAcademicos', nombre: 'Estudios Académicos' },
      { key: 'personasACargo', nombre: 'Personas a Cargo' },
      { key: 'relacionesConflicto', nombre: 'Relaciones Conflicto' },
      { key: 'vehiculos', nombre: 'Vehículos' },
      { key: 'vivienda', nombre: 'Vivienda' }
    ];

    detalles.forEach(det => {
      let rows: any[] = [];
      usuarios.forEach(u => {
        if (Array.isArray(u[det.key])) {
          u[det.key].forEach((item: any) => {
            rows.push({ 
              'ID Usuario': u.idUsuario || u.id,
              'Nombre Usuario': `${u.nombre} ${u.apellido}`,
              ...this.limpiarObjeto(item)
            });
          });
        } else if (u[det.key]) {
          rows.push({ 
            'ID Usuario': u.idUsuario || u.id,
            'Nombre Usuario': `${u.nombre} ${u.apellido}`,
            ...this.limpiarObjeto(u[det.key])
          });
        }
      });
      
      if (rows.length > 0) {
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, det.nombre);
      }
    });

    const nombreArchivo = `usuarios_detalle_${new Date().toISOString().split('T')[0]}.xlsx`;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), nombreArchivo);
  }

  /**
   * Crea datos de resumen para auditorías
   */
  private crearResumenAuditorias(auditorias: any[]): any[] {
    const total = auditorias.length;
    const creaciones = auditorias.filter(a => a.tipoPeticion === 'INSERT').length;
    const actualizaciones = auditorias.filter(a => a.tipoPeticion === 'UPDATE').length;
    const eliminaciones = auditorias.filter(a => a.tipoPeticion === 'DELETE').length;
    
    const tablasUnicas = [...new Set(auditorias.map(a => a.tablaModificada))];
    const usuariosUnicos = [...new Set(auditorias.map(a => a.usuarioModificador))];

    return [
      { 'Métrica': 'Total Auditorías', 'Valor': total },
      { 'Métrica': 'Creaciones (INSERT)', 'Valor': creaciones },
      { 'Métrica': 'Actualizaciones (UPDATE)', 'Valor': actualizaciones },
      { 'Métrica': 'Eliminaciones (DELETE)', 'Valor': eliminaciones },
      { 'Métrica': 'Tablas Modificadas', 'Valor': tablasUnicas.join(', ') },
      { 'Métrica': 'Usuarios Activos', 'Valor': usuariosUnicos.join(', ') },
      { 'Métrica': 'Fecha Generación', 'Valor': new Date().toLocaleString() }
    ];
  }

  /**
   * Limpia un objeto removiendo propiedades innecesarias
   */
  private limpiarObjeto(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    const limpio: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined && key !== 'id' && key !== 'usuario') {
        limpio[key] = obj[key];
      }
    });
    
    return limpio;
  }
} 