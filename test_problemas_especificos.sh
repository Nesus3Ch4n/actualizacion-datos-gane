#!/bin/bash

BASE_URL="http://localhost:8080/api"

echo "🔍 Probando problemas específicos..."
echo ""

# 1. Probar paso académico con semestre
echo "📚 1. Probando paso académico con semestre..."
curl -X POST "${BASE_URL}/formulario/estudios/guardar?idUsuario=2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '[
    {
      "nivelAcademico": "Pregrado",
      "programa": "Ingeniería de Sistemas",
      "institucion": "Universidad Nacional",
      "semestre": 6,
      "graduacion": "En Curso"
    }
  ]' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo ""

# 2. Probar paso contacto
echo "📞 2. Probando paso contacto..."
curl -X POST "${BASE_URL}/formulario/contactos/guardar?idUsuario=2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '[
    {
      "nombreCompleto": "Juan Pérez",
      "parentesco": "Padre",
      "numeroCelular": "3001234567"
    },
    {
      "nombreCompleto": "María Pérez",
      "parentesco": "Madre",
      "numeroCelular": "3009876543"
    }
  ]' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo ""

# 3. Probar paso declaración
echo "⚖️ 3. Probando paso declaración..."
curl -X POST "${BASE_URL}/formulario/relaciones-conflicto/guardar?idUsuario=2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-123" \
  -d '[
    {
      "nombreCompleto": "Carlos López",
      "parentesco": "Hermano",
      "tipoParteAsoc": "Demandante",
      "tieneCl": 0,
      "actualizado": 1
    }
  ]' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo ""

# 4. Verificar datos guardados
echo "🔍 4. Verificando datos guardados..."
curl -X GET "${BASE_URL}/consulta/datos-completos/2" \
  -H "Authorization: Bearer test-token-123" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "✅ Pruebas completadas" 