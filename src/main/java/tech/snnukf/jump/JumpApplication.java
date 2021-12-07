package tech.snnukf.jump;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("tech.snnukf.jump.mapper")
public class JumpApplication {
    public static void main(String[] args) {
        SpringApplication.run(JumpApplication.class, args);
    }
}
