#!/usr/bin/env python3
"""
Script para debuggear la validación del token
"""

import json
import base64
import time
from datetime import datetime

def debug_token_validation():
    """Debuggear la validación del token"""
    
    print("=== DEBUG TOKEN VALIDATION ===\n")
    
    # Token específico
    token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoieVJEeEh1cmlqNWRMSEJhSVRMclFmLzRZRmZyYk45OVl6c1Q5MnhPWXNRRmhNYlJNNjdMbm9mSC9jTGRobXRoTFZLU0VFZmVmTEJSL1lOekg3SE9mdE9FRUwwNDB6YURMN3BtK3RPRXV2SUk9IiwiaWF0IjoxNzUxNTQ4ODIxLCJleHAiOjE3NTE1NTIxMjF9.yJWZ2YtGkehRR5UccOtGFCOkYh1-MQS2nRS6mbRTa9t4UIlkodi-R1M22I3qmSyxd_RLiZR4ltPmvWdHkpi6cw"
    
    print("1. Decodificando token...")
    try:
        # Decodificar el payload
        parts = token.split('.')
        if len(parts) != 3:
            print("   ❌ Token JWT inválido")
            return
        
        header_b64, payload_b64, signature = parts
        
        # Decodificar payload
        payload_json = base64.urlsafe_b64decode(payload_b64 + '==').decode('utf-8')
        payload = json.loads(payload_json)
        print(f"   ✅ Payload decodificado")
        
        print("\n2. Información del token:")
        print(f"   🔑 Subject: {payload.get('sub', 'N/A')}")
        print(f"   🆔 Identificación: {payload.get('identificacion', 'N/A')}")
        print(f"   👤 Nombres: {payload.get('nombres', 'N/A')}")
        print(f"   📝 Apellidos: {payload.get('apellidos', 'N/A')}")
        
        print("\n3. Validación de fechas:")
        iat = payload.get('iat', 0)
        exp = payload.get('exp', 0)
        now = int(time.time())
        
        iat_date = datetime.fromtimestamp(iat)
        exp_date = datetime.fromtimestamp(exp)
        now_date = datetime.fromtimestamp(now)
        
        print(f"   📅 Emitido (iat): {iat_date.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   📅 Expira (exp): {exp_date.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   📅 Ahora: {now_date.strftime('%Y-%m-%d %H:%M:%S')}")
        
        print(f"\n4. Comparación de timestamps:")
        print(f"   iat: {iat}")
        print(f"   exp: {exp}")
        print(f"   now: {now}")
        print(f"   exp > now: {exp > now}")
        
        is_valid = exp > now
        print(f"\n5. Resultado:")
        print(f"   ✅ Token válido: {'Sí' if is_valid else 'No'}")
        
        if not is_valid:
            print(f"\n6. Problema identificado:")
            print(f"   ❌ El token expiró el {exp_date.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"   ⏰ Hora actual: {now_date.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"   🔧 Solución: Necesitamos un token válido o deshabilitar la validación de fecha")
            
    except Exception as e:
        print(f"❌ Error al procesar el token: {e}")

if __name__ == "__main__":
    debug_token_validation() 