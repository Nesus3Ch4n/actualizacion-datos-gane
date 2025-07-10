// Simular el flujo completo del frontend
console.log('🚀 Simulando flujo completo del frontend...\n');

// Simular sessionStorage
const sessionStorage = {
  'id_usuario': null,
  'usuario_actual': null
};

// Simular FormDataService
const formDataService = {
  currentUserId: null,
  getCurrentUserIdValue() {
    console.log('🔍 FormDataService.getCurrentUserIdValue():', this.currentUserId);
    return this.currentUserId;
  },
  setCurrentUserId(userId) {
    console.log('✅ FormDataService.setCurrentUserId():', userId);
    this.currentUserId = userId;
    sessionStorage['id_usuario'] = userId;
  }
};

// Simular AutoSaveService
class MockAutoSaveService {
  constructor() {
    this.formDataService = formDataService;
  }

  async saveStepData(step, data) {
    console.log(`\n📝 AutoSave: Guardando paso ${step}`);
    console.log('📋 Datos recibidos:', data);
    
    return await this.saveStepDataToBackend(step, data);
  }

  async saveStepDataToBackend(step, data) {
    console.log(`🔄 AutoSave: Iniciando guardado para paso: ${step}`);
    
    // Para el paso 'personal', no necesitamos ID de usuario inicialmente
    if (step === 'personal') {
      console.log('👤 AutoSave: Guardando información personal (sin ID requerido)');
      return await this.savePersonalInfo(data);
    }
    
    // Para otros pasos, intentar obtener el ID del usuario de múltiples fuentes
    console.log('🔍 AutoSave: Buscando ID de usuario...');
    
    let userId = this.formDataService.getCurrentUserIdValue();
    console.log('🔍 AutoSave: ID desde FormDataService:', userId);
    
    if (!userId) {
      // Intentar obtener del sessionStorage
      userId = sessionStorage['id_usuario'];
      console.log('🔍 AutoSave: ID desde sessionStorage:', userId);
    }
    
    if (!userId) {
      // Intentar obtener del UsuarioSessionService
      const usuarioActual = JSON.parse(sessionStorage['usuario_actual'] || '{}');
      userId = usuarioActual.idUsuario?.toString() || usuarioActual.id?.toString();
      console.log('🔍 AutoSave: ID desde usuario_actual:', userId);
    }
    
    if (!userId) {
      console.error('❌ AutoSave: No hay usuario activo');
      return false;
    }

    console.log(`✅ AutoSave: ID de usuario encontrado: ${userId} para paso: ${step}`);

    // Simular llamadas al backend
    switch (step) {
      case 'academico':
        return await this.simulateBackendCall('estudios', userId, data);
      case 'vehiculo':
        return await this.simulateBackendCall('vehiculos', userId, data);
      case 'vivienda':
        return await this.simulateBackendCall('vivienda', userId, data);
      case 'personas-acargo':
        return await this.simulateBackendCall('personas-acargo', userId, data);
      case 'contacto':
        return await this.simulateBackendCall('contactos', userId, data);
      case 'declaracion':
        return await this.simulateBackendCall('relaciones-conflicto', userId, data);
      default:
        console.warn(`⚠️ AutoSave: Paso desconocido: ${step}`);
        return false;
    }
  }

  async savePersonalInfo(data) {
    console.log('👤 AutoSave: Guardando información personal...');
    
    // Simular respuesta del backend con ID de usuario
    const mockResponse = {
      success: true,
      data: {
        idUsuario: 6,
        documento: data.cedula,
        nombre: data.nombre
      }
    };

    console.log('👤 AutoSave: Respuesta simulada del backend:', mockResponse);

    if (mockResponse.success) {
      // Obtener el ID del usuario de la respuesta
      const userId = mockResponse.data?.idUsuario?.toString() || mockResponse.data?.id?.toString();
      
      if (userId) {
        // Establecer el ID del usuario en el FormDataService
        this.formDataService.setCurrentUserId(userId);
        
        // Guardar también en sessionStorage para persistencia
        sessionStorage['id_usuario'] = userId;
        
        console.log('✅ AutoSave: ID de usuario establecido:', userId);
      } else {
        console.warn('⚠️ AutoSave: No se pudo obtener el ID del usuario de la respuesta');
      }
    }

    return mockResponse.success;
  }

  async simulateBackendCall(endpoint, userId, data) {
    console.log(`🌐 Simulando llamada a /api/formulario/${endpoint}/guardar?idUsuario=${userId}`);
    console.log('📤 Datos enviados:', data);
    
    // Simular respuesta exitosa
    const mockResponse = {
      success: true,
      message: `${endpoint} guardados exitosamente`,
      data: { id: 1 }
    };
    
    console.log('📥 Respuesta simulada:', mockResponse);
    return mockResponse.success;
  }
}

// Ejecutar el flujo completo
async function testCompleteFlow() {
  const autoSaveService = new MockAutoSaveService();
  
  try {
    // Paso 1: Información Personal
    console.log('\n=== PASO 1: INFORMACIÓN PERSONAL ===');
    const personalData = {
      cedula: 1006101211,
      nombre: "JESUS FELIPE CORDOBA ECHANDIA",
      correo: "jfcordoba@gana.com.co"
    };
    
    const personalSuccess = await autoSaveService.saveStepData('personal', personalData);
    console.log('✅ Paso 1 completado:', personalSuccess);
    
    // Paso 2: Información Académica
    console.log('\n=== PASO 2: INFORMACIÓN ACADÉMICA ===');
    const academicData = {
      estudios: [
        {
          nivelEducativo: "Universidad",
          titulo: "Ingenieria de Sistemas",
          institucion: "Universidad Nacional",
          semestre: 10,
          graduado: true
        }
      ]
    };
    
    const academicSuccess = await autoSaveService.saveStepData('academico', academicData);
    console.log('✅ Paso 2 completado:', academicSuccess);
    
    // Paso 3: Vehículos
    console.log('\n=== PASO 3: VEHÍCULOS ===');
    const vehicleData = {
      vehiculos: [
        {
          marca: "Toyota",
          placa: "ABC123",
          tipo: "PARTICULAR",
          anio: 2020
        }
      ]
    };
    
    const vehicleSuccess = await autoSaveService.saveStepData('vehiculo', vehicleData);
    console.log('✅ Paso 3 completado:', vehicleSuccess);
    
    // Paso 4: Vivienda
    console.log('\n=== PASO 4: VIVIENDA ===');
    const housingData = {
      tipoVivienda: "Casa",
      direccion: "Calle 123 #45-67",
      barrio: "Centro",
      ciudad: "Cali"
    };
    
    const housingSuccess = await autoSaveService.saveStepData('vivienda', housingData);
    console.log('✅ Paso 4 completado:', housingSuccess);
    
    // Paso 5: Personas a Cargo
    console.log('\n=== PASO 5: PERSONAS A CARGO ===');
    const dependentsData = {
      personas: [
        {
          nombre: "María González",
          parentesco: "Madre",
          fechaNacimiento: "1975-05-15"
        }
      ]
    };
    
    const dependentsSuccess = await autoSaveService.saveStepData('personas-acargo', dependentsData);
    console.log('✅ Paso 5 completado:', dependentsSuccess);
    
    // Paso 6: Contactos de Emergencia
    console.log('\n=== PASO 6: CONTACTOS DE EMERGENCIA ===');
    const contactsData = {
      contactos: [
        {
          nombre: "Carlos Rodríguez",
          parentesco: "Hermano",
          telefono: "3109876543"
        }
      ]
    };
    
    const contactsSuccess = await autoSaveService.saveStepData('contacto', contactsData);
    console.log('✅ Paso 6 completado:', contactsSuccess);
    
    // Paso 7: Declaraciones de Conflicto
    console.log('\n=== PASO 7: DECLARACIONES DE CONFLICTO ===');
    const declarationsData = {
      declaraciones: [
        {
          nombrePersona: "Ana Martínez",
          parentesco: "Hermana",
          tipoRelacion: "Familiar"
        }
      ]
    };
    
    const declarationsSuccess = await autoSaveService.saveStepData('declaracion', declarationsData);
    console.log('✅ Paso 7 completado:', declarationsSuccess);
    
    console.log('\n🎉 ¡Flujo completo simulado exitosamente!');
    console.log('📊 Estado final del sessionStorage:', sessionStorage);
    console.log('📊 Estado final del FormDataService:', formDataService.currentUserId);
    
  } catch (error) {
    console.error('❌ Error en el flujo simulado:', error);
  }
}

// Ejecutar la prueba
testCompleteFlow(); 