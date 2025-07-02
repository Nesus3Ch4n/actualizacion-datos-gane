import { Injectable } from '@angular/core';
import { Reporte } from '../../domain/entities/reporte.entity';

@Injectable({
  providedIn: 'root'
})
export class ExcelGeneratorService {
  
  constructor() {}

  /**
   * Genera un archivo Excel basado en los datos del reporte
   */
  async generarExcel(reporte: Reporte): Promise<ArchivoGenerado> {
    try {
      console.log('Generando archivo Excel para:', reporte.tipoReporteValue);
      
      const nombreArchivo = this.generarNombreArchivo(reporte, 'xlsx');
      const datos = reporte.datos;
      
      await this.simularProcesamientoArchivo();
      
      return {
        url: `/downloads/${nombreArchivo}`,
        ruta: `/temp/reports/${nombreArchivo}`,
        tamanio: this.calcularTamanioArchivo(datos.length),
        nombreArchivo: nombreArchivo
      };
      
    } catch (error) {
      throw new Error(`Error generando archivo Excel: ${error}`);
    }
  }

  /**
   * Genera archivo según el formato especificado
   */
  async generarArchivo(reporte: Reporte, formato: 'xlsx' | 'csv' | 'pdf'): Promise<ArchivoGenerado> {
    switch (formato) {
      case 'xlsx':
        return this.generarExcel(reporte);
      case 'csv':
        return this.generarCSV(reporte);
      case 'pdf':
        return this.generarPDF(reporte);
      default:
        throw new Error(`Formato no soportado: ${formato}`);
    }
  }

  async generarCSV(reporte: Reporte): Promise<ArchivoGenerado> {
    console.log('Generando CSV...');
    const nombreArchivo = this.generarNombreArchivo(reporte, 'csv');
    await this.simularProcesamientoArchivo();
    
    return {
      url: `/downloads/${nombreArchivo}`,
      ruta: `/temp/reports/${nombreArchivo}`,
      tamanio: this.calcularTamanioArchivo(reporte.datos.length),
      nombreArchivo: nombreArchivo
    };
  }

  async generarPDF(reporte: Reporte): Promise<ArchivoGenerado> {
    console.log('Generando PDF...');
    const nombreArchivo = this.generarNombreArchivo(reporte, 'pdf');
    await this.simularProcesamientoArchivo();
    
    return {
      url: `/downloads/${nombreArchivo}`,
      ruta: `/temp/reports/${nombreArchivo}`,
      tamanio: this.calcularTamanioArchivo(reporte.datos.length),
      nombreArchivo: nombreArchivo
    };
  }

  /**
   * Valida si un archivo puede ser generado
   */
  puedeGenerar(reporte: Reporte, formato: string): boolean {
    if (!reporte.esReporteValido()) {
      return false;
    }
    
    const formatosValidos = ['xlsx', 'csv', 'pdf'];
    return formatosValidos.includes(formato);
  }

  /**
   * Obtiene el tamaño estimado del archivo antes de generarlo
   */
  obtenerTamanioEstimado(reporte: Reporte, formato: string): string {
    const numeroRegistros = reporte.numeroRegistros;
    let factorMultiplicador = 1;
    
    switch (formato) {
      case 'xlsx':
        factorMultiplicador = 150; // bytes por registro aprox
        break;
      case 'csv':
        factorMultiplicador = 80; // bytes por registro aprox
        break;
      case 'pdf':
        factorMultiplicador = 200; // bytes por registro aprox
        break;
    }
    
    const tamanioBytes = numeroRegistros * factorMultiplicador;
    return this.formatearTamanio(tamanioBytes);
  }

  private generarNombreArchivo(reporte: Reporte, extension: string): string {
    const fecha = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    return `${reporte.tipoReporteValue}_${fecha}_${timestamp}.${extension}`;
  }

  private async simularProcesamientoArchivo(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  private calcularTamanioArchivo(numeroRegistros: number): string {
    const tamanioBytes = numeroRegistros * 120;
    if (tamanioBytes < 1024) {
      return `${tamanioBytes} B`;
    } else if (tamanioBytes < 1024 * 1024) {
      return `${(tamanioBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(tamanioBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  }

  private formatearTamanio(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  }
}

// Interfaz para el archivo generado
export interface ArchivoGenerado {
  url: string;
  ruta: string;
  tamanio: string;
  nombreArchivo: string;
} 