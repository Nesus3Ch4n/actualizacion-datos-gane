const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
const TOKEN = 'test-token';

// Configurar axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  }
});

async function testCompleteFlow() {
  try {
    console.log('🚀 Iniciando prueba del flujo completo...\n');

    // Paso 1: Guardar información personal (crear nuevo usuario)
    console.log('📝 Paso 1: Guardando información personal...');
    const personalData = {
      documento: 1006101211,
      cedulaExpedicion: "Cali",
      nombre: "JESUS FELIPE CORDOBA ECHANDIA",
      fechaNacimiento: "2001-10-25",
      paisNacimiento: "Colombia",
      ciudadNacimiento: "Cali",
      cargo: "APRENDIZ TIC SENIOR",
      area: "SOLUCIONES INFORMATICAS",
      estadoCivil: "Soltero",
      tipoSangre: "O+",
      numeroCelular: 3186183326,
      numeroFijo: 3104128521,
      numeroCorp: 3186183326,
      correo: "jfcordoba@gana.com.co"
    };

    const personalResponse = await api.post('/api/formulario/informacion-personal/guardar', personalData);
    console.log('✅ Información personal guardada:', personalResponse.data);

    // Obtener el ID del usuario de la respuesta
    const userId = personalResponse.data.data?.idUsuario || personalResponse.data.data?.id;
    console.log('👤 ID de usuario obtenido:', userId);

    if (!userId) {
      console.error('❌ No se pudo obtener el ID del usuario');
      return;
    }

    // Paso 2: Guardar información académica
    console.log('\n📚 Paso 2: Guardando información académica...');
    const academicData = [
      {
        nivelAcademico: "Universidad",
        programa: "Ingenieria de Sistemas",
        institucion: "Universidad Nacional",
        semestre: 10,
        graduacion: "Graduado"
      }
    ];

    const academicResponse = await api.post(`/api/formulario/estudios/guardar?idUsuario=${userId}`, academicData);
    console.log('✅ Información académica guardada:', academicResponse.data);

    // Paso 3: Guardar información de vehículos
    console.log('\n🚗 Paso 3: Guardando información de vehículos...');
    const vehicleData = [
      {
        marca: "Toyota",
        modelo: "Corolla",
        placa: "ABC123",
        tipo: "PARTICULAR",
        color: "Blanco",
        anio: 2020
      }
    ];

    const vehicleResponse = await api.post(`/api/formulario/vehiculos/guardar?idUsuario=${userId}`, vehicleData);
    console.log('✅ Información de vehículos guardada:', vehicleResponse.data);

    // Paso 4: Guardar información de vivienda
    console.log('\n🏠 Paso 4: Guardando información de vivienda...');
    const housingData = {
      direccion: "Calle 123 #45-67",
      tipoVivienda: "Casa",
      barrio: "Centro",
      ciudad: "Cali",
      departamento: "Valle del Cauca"
    };

    const housingResponse = await api.post(`/api/formulario/vivienda/guardar?idUsuario=${userId}`, housingData);
    console.log('✅ Información de vivienda guardada:', housingResponse.data);

    // Paso 5: Guardar personas a cargo
    console.log('\n👨‍👩‍👧‍👦 Paso 5: Guardando personas a cargo...');
    const dependentsData = [
      {
        nombre: "María González",
        parentesco: "Madre",
        fechaNacimiento: "1975-05-15",
        ocupacion: "Ama de casa",
        telefono: "3001234567"
      }
    ];

    const dependentsResponse = await api.post(`/api/formulario/personas-acargo/guardar?idUsuario=${userId}`, dependentsData);
    console.log('✅ Personas a cargo guardadas:', dependentsResponse.data);

    // Paso 6: Guardar contactos de emergencia
    console.log('\n📞 Paso 6: Guardando contactos de emergencia...');
    const contactsData = [
      {
        nombre: "Carlos Rodríguez",
        parentesco: "Hermano",
        telefono: "3109876543",
        direccion: "Calle 456 #78-90",
        ocupacion: "Ingeniero"
      }
    ];

    const contactsResponse = await api.post(`/api/formulario/contactos/guardar?idUsuario=${userId}`, contactsData);
    console.log('✅ Contactos de emergencia guardados:', contactsResponse.data);

    // Paso 7: Guardar declaraciones de conflicto
    console.log('\n⚖️ Paso 7: Guardando declaraciones de conflicto...');
    const declarationsData = [
      {
        tipoRelacion: "Familiar",
        nombrePersona: "Ana Martínez",
        cargo: "Gerente",
        empresa: "Empresa ABC",
        descripcion: "Hermana trabaja en empresa relacionada"
      }
    ];

    const declarationsResponse = await api.post(`/api/formulario/relaciones-conflicto/guardar?idUsuario=${userId}`, declarationsData);
    console.log('✅ Declaraciones de conflicto guardadas:', declarationsResponse.data);

    console.log('\n🎉 ¡Flujo completo probado exitosamente!');
    console.log(`📊 Usuario ID: ${userId}`);
    console.log('✅ Todos los pasos se guardaron correctamente con auditoría');

  } catch (error) {
    console.error('❌ Error en el flujo completo:', error.response?.data || error.message);
  }
}

// Ejecutar la prueba
testCompleteFlow(); 