package com.cinereservas.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Versión moderna de csrf().disable()
                .authorizeHttpRequests(authz -> authz  // Versión moderna de authorizeRequests()
                        .requestMatchers("/api/public/**").permitAll()
                        // Añade aquí tus otras reglas de autorización
                        .anyRequest().authenticated()
                );

        // Configuración adicional si es necesaria

        return http.build();
    }

    // Otros beans de configuración de seguridad...
}