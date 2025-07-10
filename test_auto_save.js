const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

async function testAutoSave() {
  try {
    console.log('🧪 Probando auto-guardado...');
    
    // Paso 1: Crear un usuario de prueba
    console.log('\n📝 Paso 1: Creando usuario de prueba...');
    const userData = {
      documento: '123456789',
      cedulaExpedicion: 'BOG',
      nombre: 'Juan Pérez',
      fechaNacimiento: '1990-01-01',
      paisNacimiento: 'Colombia',
      ciudadNacimiento: 'Bogotá',
      cargo: 'Desarrollador',
      area: 'TI',
      estadoCivil: 'Soltero',
      tipoSangre: 'O+',
      numeroCelular: '3001234567',
      numeroFijo: '6011234567',
      numeroCorp: '6011234568',
      correo: 'juan.perez@empresa.com'
    };

    const createResponse = await axios.post(`${BASE_URL}/formulario/informacion-personal/guardar`, userData);
    console.log('✅ Usuario creado:', createResponse.data);

    if (createResponse.data.success) {
      const userId = createResponse.data.data?.idUsuario || createResponse.data.idUsuario;
      console.log('👤 ID del usuario:', userId);

      // Paso 2: Probar guardado de información académica
      console.log('\n📚 Paso 2: Probando guardado de información académica...');
      const academicData = {
        estudios: [
          {
            nivelEducativo: 'Universidad',
            titulo: 'Ingeniería de Sistemas',
            institucion: 'Universidad Nacional',
            semestre: '10',
            graduado: true
          }
        ]
      };

      const academicResponse = await axios.post(`${BASE_URL}/formulario/estudios/guardar?idUsuario=${userId}`, academicData.estudios);
      console.log('✅ Información académica guardada:', academicResponse.data);

      // Paso 3: Probar guardado de vehículos
      console.log('\n🚗 Paso 3: Probando guardado de vehículos...');
      const vehicleData = {
        vehiculos: [
          {
            marca: 'Toyota',
            modelo: 'Corolla',
            placa: 'ABC123',
            anio: 2020
          }
        ]
      };

      const vehicleResponse = await axios.post(`${BASE_URL}/formulario/vehiculos/guardar?idUsuario=${userId}`, vehicleData.vehiculos);
      console.log('✅ Vehículos guardados:', vehicleResponse.data);

      // Paso 4: Verificar auditoría
      console.log('\n📋 Paso 4: Verificando auditoría...');
      const auditResponse = await axios.get(`${BASE_URL}/auditoria/por-usuario/${userId}`);
      console.log('✅ Auditoría encontrada:', auditResponse.data);

      console.log('\n🎉 ¡Prueba completada exitosamente!');
    } else {
      console.error('❌ Error creando usuario:', createResponse.data);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.data || error.message);
  }
}

testAutoSave(); 