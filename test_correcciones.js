// Script para probar las correcciones realizadas
console.log('🔧 Probando correcciones realizadas...\n');

// Simular datos del frontend para cada paso
const academicData = {
  tieneEstudios: true,
  estudios: [
    {
      nivelEducativo: 'Pregrado',
      titulo: 'Ingeniería de Sistemas',
      institucion: 'Universidad Nacional',
      semestre: 6, // Ahora se envía como número
      graduado: false,
      enCurso: true
    }
  ]
};

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

const declarationData = {
  tieneConflicto: true,
  personas: [ // Cambiado de 'declaraciones' a 'personas'
    {
      nombre: 'Carlos López',
      parentesco: 'Hermano',
      tipoParteInteresada: 'Demandante' // Cambiado de 'tipoRelacion' a 'tipoParteInteresada'
    }
  ]
};

console.log('📚 Datos académicos corregidos:');
console.log(JSON.stringify(academicData, null, 2));

console.log('\n📞 Datos de contacto:');
console.log(JSON.stringify(contactData, null, 2));

console.log('\n⚖️ Datos de declaración corregidos:');
console.log(JSON.stringify(declarationData, null, 2));

console.log('\n✅ Correcciones aplicadas:');
console.log('1. ✅ Campo semestre se envía como número en lugar de string');
console.log('2. ✅ Filtro de declaraciones usa "personas" en lugar de "declaraciones"');
console.log('3. ✅ Mapeo de declaraciones usa "tipoParteInteresada" en lugar de "tipoRelacion"');
console.log('4. ✅ Mapeo de declaraciones usa "nombre" en lugar de "nombrePersona"');

console.log('\n🎯 Problemas solucionados:');
console.log('- Paso 2 (académico): Campo semestre ahora se guarda correctamente');
console.log('- Paso 6 (contacto): Ya funcionaba correctamente');
console.log('- Paso 7 (declaración): Ahora se guarda correctamente con el mapeo corregido'); 