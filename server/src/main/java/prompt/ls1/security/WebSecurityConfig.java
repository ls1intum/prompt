package prompt.ls1.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(
        // securedEnabled = true,
        // jsr250Enabled = true,
        prePostEnabled = true)
public class WebSecurityConfig {

    private final JwtAuthConverter jwtAuthConverter;

    @Value("${prompt.client.host}")
    private String clientHost;

    @Bean
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeHttpRequests().requestMatchers(HttpMethod.GET, "/actuator/*").permitAll().and()
                .authorizeHttpRequests().requestMatchers(HttpMethod.POST, "/applications/developer").permitAll().and()
                .authorizeHttpRequests().requestMatchers(HttpMethod.POST, "/applications/tutor").permitAll().and()
                .authorizeHttpRequests().requestMatchers(HttpMethod.POST, "/applications/coach").permitAll().and()
                .authorizeHttpRequests().requestMatchers(HttpMethod.POST, "/thesis-applications").permitAll().and()
                .authorizeHttpRequests().requestMatchers(HttpMethod.GET, "/skills").permitAll().and()
                .authorizeHttpRequests().requestMatchers(HttpMethod.GET, "/course-iterations/**").permitAll().and()
                .authorizeHttpRequests().requestMatchers(HttpMethod.GET, "/project-teams").permitAll().and()
                .authorizeHttpRequests().requestMatchers(HttpMethod.POST, "/intro-course/*/verify-student/**").permitAll().and()
                .authorizeHttpRequests().requestMatchers(HttpMethod.POST, "/intro-course/*/technical-details/**").permitAll()
                .anyRequest().authenticated().and().oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
        http.oauth2ResourceServer()
                .jwt()
                .jwtAuthenticationConverter(jwtAuthConverter);
        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("http://localhost:3000",
                        String.format("https://%s", clientHost),
                        String.format("http://%s", clientHost)).allowedMethods("*");
            }
        };
    }
}
