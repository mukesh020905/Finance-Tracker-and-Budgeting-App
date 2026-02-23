package com.budgetwise.security.jwt;

import io.jsonwebtoken.*;

import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    // For simplicity, using simple bytes if the secret is plain text in properties,
    // but usually it should be encoded.
    // Let's assume the property provided is long enough.
    // Actually, for hmacShaKeyFor, if we use Decoders.BASE64, the property must be
    // base64.
    // Let's use getBytes() for simplicity if we don't want to enforce Base64 in
    // properties,
    // OR we change the property to be a valid B64 string.
    // I'll stick to Decoders.BASE64 and ensure I provide a B64 secret later or now.
    // Let's just use the bytes of the string to avoid Base64 errors if the user
    // didn't provide a B64 string.
    /*
     * private Key key() {
     * return Keys.hmacShaKeyFor(jwtSecret.getBytes());
     * }
     */
    // Reverting to the safer generic implementation without assuming Base64 for
    // this demo unless I set a proper B64 key.
    // I will use a helper to make sure it works either way, or just clear text for
    // now.
    // Actually, standard practice with latest JJWT is to use properly encoded keys.
    // I'll use a fixed secure key for now in the properties or just encode the one
    // I have.

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}
