const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

// Configuración para las peticiones
const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token-123'
  }
};

async function testProblemasEspecificos() {
  console.log('🔍 Probando problemas específicos...\n');

  try {
    // 1. Probar paso académico con semestre
    console.log('📚 1. Probando paso académico con semestre...');
    const academicData = {
      tieneEstudios: true,
      estudios: [
        {
          nivelEducativo: 'Pregrado',
          titulo: 'Ingeniería de Sistemas',
          institucion: 'Universidad Nacional',
          semestre: '6', // Este campo debería guardarse
          graduado: false,
          enCurso: true
        }
      ]
    };

    const academicResponse = await axios.post(
      `${BASE_URL}/formulario/estudios/guardar?idUsuario=2`,
      academicData.estudios,
      config
    );

    console.log('✅ Respuesta académico:', academicResponse.data);

    // 2. Probar paso contacto
    console.log('\n📞 2. Probando paso contacto...');
    const contactData = {
      contactos: [
        {
          nombre: 'Juan Pérez',
          parentesco: 'Padre',
          telefono: '3001234567'
        },
        {
          nombre: 'María Pérez',
          parentesco: 'Madre',
          telefono: '3009876543'
        }
      ]
    };

    const contactResponse = await axios.post(
      `${BASE_URL}/formulario/contactos/guardar?idUsuario=2`,
      contactData.contactos,
      config
    );

    console.log('✅ Respuesta contacto:', contactResponse.data);

    // 3. Probar paso declaración
    console.log('\n⚖️ 3. Probando paso declaración...');
    const declarationData = {
      tieneConflicto: true,
      personas: [
        {
          nombre: 'Carlos López',
          parentesco: 'Hermano',
          tipoParteInteresada: 'Demandante'
        }
      ]
    };

    const declarationResponse = await axios.post(
      `${BASE_URL}/formulario/relaciones-conflicto/guardar?idUsuario=2`,
      declarationData.personas,
      config
    );

    console.log('✅ Respuesta declaración:', declarationResponse.data);

    // 4. Verificar datos guardados
    console.log('\n🔍 4. Verificando datos guardados...');
    
    const datosCompletos = await axios.get(
      `${BASE_URL}/consulta/datos-completos/2`,
      config
    );

    console.log('📊 Datos completos del usuario:');
    console.log('- Estudios:', datosCompletos.data.estudios?.length || 0);
    console.log('- Contactos:', datosCompletos.data.contactosEmergencia?.length || 0);
    console.log('- Declaraciones:', datosCompletos.data.declaracionesConflicto?.length || 0);

    if (datosCompletos.data.estudios?.length > 0) {
      console.log('📚 Detalle del primer estudio:');
      console.log(JSON.stringify(datosCompletos.data.estudios[0], null, 2));
    }

    if (datosCompletos.data.contactosEmergencia?.length > 0) {
      console.log('📞 Detalle del primer contacto:');
      console.log(JSON.stringify(datosCompletos.data.contactosEmergencia[0], null, 2));
    }

    if (datosCompletos.data.declaracionesConflicto?.length > 0) {
      console.log('⚖️ Detalle de la primera declaración:');
      console.log(JSON.stringify(datosCompletos.data.declaracionesConflicto[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar las pruebas
testProblemasEspecificos(); 