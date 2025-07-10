// Script para probar los campos faltantes identificados
console.log('🔍 Analizando campos faltantes...\n');

// 1. Problema: Semestre no se guarda en paso académico
console.log('📚 1. Problema con semestre en paso académico:');
const academicData = {
  tieneEstudios: true,
  estudios: [
    {
      nivelEducativo: 'Pregrado',
      titulo: 'Ingeniería de Sistemas',
      institucion: 'Universidad Nacional',
      semestre: 6, // ← Debería guardarse como INTEGER
      graduado: false,
      enCurso: true
    }
  ]
};

console.log('Datos académicos enviados:', JSON.stringify(academicData, null, 2));

// 2. Problema: fecha_nacimiento y edad no se guardan en personas a cargo
console.log('\n👨‍👩‍👧‍👦 2. Problema con fecha_nacimiento y edad en personas a cargo:');
const dependentsData = {
  personas: [
    {
      nombre: 'Juan Pérez',
      parentesco: 'Hijo',
      fechaNacimiento: '2010-05-15', // ← Debería guardarse
      edad: 13 // ← Debería calcularse y guardarse
    }
  ]
};

console.log('Datos de personas a cargo enviados:', JSON.stringify(dependentsData, null, 2));

// 3. Problema: tipo_adquisicion no se guarda en vivienda
console.log('\n🏠 3. Problema con tipo_adquisicion en vivienda:');
const housingData = {
  tipoVivienda: 'Propia',
  direccion: 'Calle 123 #45-67',
  barrio: 'Centro',
  ciudad: 'Bogotá',
  tipoAdquisicion: 'Compra', // ← Debería guardarse
  ano: 2020
};

console.log('Datos de vivienda enviados:', JSON.stringify(housingData, null, 2));

// 4. Problema: fecha_creacion no se guarda en declaraciones
console.log('\n⚖️ 4. Problema con fecha_creacion en declaraciones:');
const declarationData = {
  tieneConflicto: true,
  personas: [
    {
      nombre: 'Carlos López',
      parentesco: 'Hermano',
      tipoParteInteresada: 'Demandante'
      // fecha_creacion debería generarse automáticamente
    }
  ]
};

console.log('Datos de declaración enviados:', JSON.stringify(declarationData, null, 2));

console.log('\n🎯 Problemas identificados:');
console.log('1. ✅ Semestre: Se envía como número pero puede no estar llegando al backend');
console.log('2. ✅ Fecha nacimiento y edad: Se calculan pero pueden no estar mapeándose correctamente');
console.log('3. ✅ Tipo adquisición: Se envía pero puede no estar mapeándose correctamente');
console.log('4. ✅ Fecha creación: No se está enviando desde el frontend (debería ser automática)');

console.log('\n🔧 Soluciones necesarias:');
console.log('1. Verificar que el backend reciba correctamente el campo semestre');
console.log('2. Asegurar que fechaNacimiento y edad se mapeen correctamente');
console.log('3. Asegurar que tipoAdquisicion se mapee correctamente');
console.log('4. El backend debería generar fecha_creacion automáticamente'); 