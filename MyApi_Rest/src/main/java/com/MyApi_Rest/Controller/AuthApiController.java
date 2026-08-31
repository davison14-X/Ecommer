package com.MyApi_Rest.Controller;

import com.MyApi_Rest.Dto.AuthRequest;
import com.MyApi_Rest.Dto.AuthResponse;
import com.MyApi_Rest.Model.Usuario;
import com.MyApi_Rest.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthApiController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Completa todos los campos."));
        }

        if (request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(AuthResponse.error("La contraseña debe tener mínimo 6 caracteres."));
        }

        if (usuarioRepository.findByEmail(request.getEmail().trim().toLowerCase()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(AuthResponse.error("Este correo ya está registrado."));
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail().trim().toLowerCase());
        usuario.setUsername(request.getEmail().trim().toLowerCase());
        usuario.setNombre(request.getName().trim());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRole("client");

        usuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(new AuthResponse(usuario.getId(), usuario.getName(), usuario.getEmail(), usuario.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Completa todos los campos."));
        }

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail().trim().toLowerCase());
        if (usuario == null || !passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("Correo o contraseña incorrectos."));
        }

        return ResponseEntity.ok(new AuthResponse(usuario.getId(), usuario.getName(), usuario.getEmail(), usuario.getRole()));
    }
}
