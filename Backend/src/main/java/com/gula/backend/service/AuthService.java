package com.gula.backend.service;

import com.gula.backend.dto.AuthRequest;
import com.gula.backend.dto.AuthResponse;
import com.gula.backend.dto.RegisterRequest;
import com.gula.backend.model.Usuario;
import com.gula.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.gula.backend.model.Rol;


@Service
public class AuthService {

    private final UsuarioRepository repo;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository repo, JwtService jwtService) {
        this.repo = repo;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public AuthResponse register(RegisterRequest request) {
        // Forzar rol CLIENTE si no viene definido (registro desde el front)
        var rolAsignado = request.getRol() != null ? request.getRol() : Rol.CLIENTE;

        Usuario usuario = new Usuario(
                request.getNombre(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                rolAsignado
        );

        repo.save(usuario);

        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRol().name());
        return new AuthResponse(token);
    }

    public AuthResponse login(AuthRequest request) {
        Usuario user = repo.findByEmail(request.getEmail()).orElseThrow();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRol().name());
        return new AuthResponse(token);
    }
}

