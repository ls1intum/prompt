package prompt.ls1.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.saml2.core.Saml2X509Credential;
import org.springframework.security.saml2.provider.service.metadata.OpenSamlMetadataResolver;
import org.springframework.security.saml2.provider.service.registration.InMemoryRelyingPartyRegistrationRepository;
import org.springframework.security.saml2.provider.service.registration.RelyingPartyRegistration;
import org.springframework.security.saml2.provider.service.registration.RelyingPartyRegistrationRepository;
import org.springframework.security.saml2.provider.service.registration.RelyingPartyRegistrations;
import org.springframework.security.saml2.provider.service.web.DefaultRelyingPartyRegistrationResolver;
import org.springframework.security.saml2.provider.service.web.RelyingPartyRegistrationResolver;
import org.springframework.security.saml2.provider.service.web.Saml2MetadataFilter;
import org.springframework.security.saml2.provider.service.web.authentication.Saml2WebSsoAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(
        // securedEnabled = true,
        // jsr250Enabled = true,
        prePostEnabled = true)
public class WebSecurityConfig {

    @Value("${prompt.client.host}")
    private String clientHost;

    /*@Bean
    public RelyingPartyRegistrationRepository relyingPartyRegistrations() throws Exception {
        RelyingPartyRegistration registration = RelyingPartyRegistration
                .withRegistrationId("example")
                .assertingPartyDetails(party -> party
                        .entityId("https://idp.example.com/issuer")
                        .singleSignOnServiceLocation("https://idp.example.com/SSO.saml2")
                        .wantAuthnRequestsSigned(false)
                )
                .build();
        return new InMemoryRelyingPartyRegistrationRepository(registration);
    }*/

    private X509Certificate loadCertificateFromResource(ClassPathResource resource) throws Exception {
        InputStream inputStream = null;
        try {
            inputStream = resource.getInputStream();
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            Certificate certificate = certificateFactory.generateCertificate(inputStream);
            if (certificate instanceof X509Certificate) {
                return (X509Certificate) certificate;
            } else {
                throw new IllegalArgumentException("The certificate is not an X.509 certificate.");
            }
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    // Handle the exception appropriately
                }
            }
        }
    }

    private PrivateKey loadPrivateKeyFromResource(ClassPathResource resource) throws Exception {
        InputStream privateKeyStream = resource.getInputStream();
        BufferedReader privateKeyReader = new BufferedReader(new InputStreamReader(privateKeyStream));
        StringBuilder privateKeyBuilder = new StringBuilder();
        String line;
        while ((line = privateKeyReader.readLine()) != null) {
            if (!line.contains("-----BEGIN") && !line.contains("-----END")) {
                privateKeyBuilder.append(line);
            }
        }
        byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyBuilder.toString());
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
        return keyFactory.generatePrivate(privateKeySpec);
    }

    @Bean
    public RelyingPartyRegistrationRepository relyingPartyRegistrations() throws Exception {
        X509Certificate certificate = loadCertificateFromResource(new ClassPathResource("public.cer"));
        PrivateKey privateKey = loadPrivateKeyFromResource(new ClassPathResource("private.key"));

        Saml2X509Credential credential = new Saml2X509Credential(privateKey, certificate, Saml2X509Credential.Saml2X509CredentialType.SIGNING);

        RelyingPartyRegistration relyingPartyRegistration = RelyingPartyRegistrations
                .fromMetadataLocation("http://localhost:8081/realms/prompt/protocol/saml/descriptor")
                .entityId("prompt-app")
                .registrationId("prompt-app")
                /*.assertingPartyDetails(d -> {

                    d
                            .entityId("http://localhost:8081/realms/prompt")
                            .singleSignOnServiceBinding(Saml2MessageBinding.POST);
                            //.singleSignOnServiceLocation("http://localhost:8081/realms/prompt/protocol/saml/clients/prompt");
                })*/
                .signingX509Credentials(credentials -> credentials.add(credential))
                .build();

        return new InMemoryRelyingPartyRegistrationRepository(relyingPartyRegistration);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        Converter<HttpServletRequest, RelyingPartyRegistration> relyingPartyRegistrationResolver =
                new DefaultRelyingPartyRegistrationResolver(relyingPartyRegistrations());
        Saml2MetadataFilter filter = new Saml2MetadataFilter((RelyingPartyRegistrationResolver) relyingPartyRegistrationResolver, new OpenSamlMetadataResolver());

        http.authorizeHttpRequests(authorize -> authorize.anyRequest()
                        .authenticated())
                /*.saml2Login(httpSecuritySaml2LoginConfigurer -> {
                    httpSecuritySaml2LoginConfigurer
                            .defaultSuccessUrl("/home")
                            .failureUrl("/saml2/login?error=true");
                })*/
                .saml2Login(withDefaults())
                .saml2Logout(withDefaults())
                .addFilterBefore(filter, Saml2WebSsoAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("http://localhost:3000",
                        String.format("http://%s", clientHost),
                        String.format("http://%s:80", clientHost)).allowedMethods("*");
            }
        };
    }
}
