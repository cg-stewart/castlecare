package com.callcastlecare.api.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Converter for extracting authorities from AWS Cognito JWT tokens.
 */
@Component
public class JwtConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtGrantedAuthoritiesConverter defaultConverter = new JwtGrantedAuthoritiesConverter();

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        return new JwtAuthenticationToken(jwt, authorities);
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Collection<GrantedAuthority> authorities = new ArrayList<>(defaultConverter.convert(jwt));
        
        // Extract Cognito groups from token claims
        Map<String, Object> claims = jwt.getClaims();
        
        // Cognito puts groups in 'cognito:groups' claim
        if (claims.containsKey("cognito:groups")) {
            List<?> groups = (List<?>) claims.get("cognito:groups");
            Collection<GrantedAuthority> groupAuthorities = groups.stream()
                    .map(group -> new SimpleGrantedAuthority("ROLE_" + group.toString().toUpperCase()))
                    .collect(Collectors.toList());
            authorities.addAll(groupAuthorities);
        }
        
        return authorities;
    }
}
