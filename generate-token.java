import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class GenerateToken {
    public static void main(String[] args) {
        String secret = "fSgf8DIYHu0++urpkBN5bXiUvwv/+RW7gZePs2meu1w2RCGnCr08+pCAFrmqlazg";
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", "CP1006101211");
        claims.put("idtipodocumento", "1");
        claims.put("identificacion", "1006101211");
        claims.put("nombres", "JESUS FELIPE");
        claims.put("apellidos", "CORDOBA ECHANDIA");
        claims.put("idroles", "5");
        claims.put("idpantallas", "16,67,42,12,13,14,15");
        claims.put("experience", "yRDxHurij5dLHBaITLrQf/4YFfrbN99YzsT92xOYsQFhMbRM67LnofH/cLdhmrhLVKSEEfefLBR/YNzH7HOftOEEL040zaDL7pm+tOEuvII=");
        
        Date now = new Date();
        Date expiration = new Date(now.getTime() + 3600000); // 1 hora
        
        String token = Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(expiration)
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS512)
            .compact();
            
        System.out.println("Token generado:");
        System.out.println(token);
    }
} 