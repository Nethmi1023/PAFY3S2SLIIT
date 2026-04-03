package com.university.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Security configuration for the application
 * Defines access rules for different endpoints and user roles
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configure security filter chain
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(authz -> authz
                // H2 Console - for development only
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                .requestMatchers(HttpMethod.GET, "/auth/me").authenticated()

                // Read-only access for authenticated USER and ADMIN
                .requestMatchers(HttpMethod.GET, "/resources/**").hasAnyRole("USER", "ADMIN")

                // Write access only for ADMIN
                .requestMatchers(HttpMethod.POST, "/resources/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/resources/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/resources/**").hasRole("ADMIN")
                .requestMatchers("/resources/**").hasRole("ADMIN")

                // Booking endpoints - USER and ADMIN can create/view/cancel own bookings
                .requestMatchers(HttpMethod.POST, "/bookings").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/bookings/my").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/bookings/{id}").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/bookings/*/cancel").hasAnyRole("USER", "ADMIN")
                // Admin-only booking management
                .requestMatchers(HttpMethod.GET, "/bookings").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/bookings/*/confirm").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/bookings/resource/**").hasRole("ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> {})
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())); // For H2 Console

        return http.build();
    }

    /**
     * In-memory user details for MongoDB-based authentication
     * Users are defined at startup (not persisted across restarts)
     */
    @Bean
    public UserDetailsManager userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();

        UserDetails adminUser = User.builder()
            .username("admin")
            .password(passwordEncoder().encode("admin123"))
            .roles("ADMIN", "USER")
            .build();
        manager.createUser(adminUser);

        UserDetails normalUser = User.builder()
            .username("user")
            .password(passwordEncoder().encode("user123"))
            .roles("USER")
            .build();
        manager.createUser(normalUser);

        return manager;
    }

    /**
     * Password encoder bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configure CORS to allow React frontend to communicate with backend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
