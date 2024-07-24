package Security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("jwt.auth.converter")
@Getter
@Setter
public class JwtConverterProperties {
    private String resourceId;
    private String principalAttribute;
}
