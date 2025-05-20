package com.gula.backend.controller;

import com.gula.backend.dto.AuthRequest;
import com.gula.backend.dto.AuthResponse;
import com.gula.backend.dto.RegisterRequest;
import com.gula.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.gula.backend.dto.UsuarioDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import com.gula.backend.model.Rol;


// otros imports...




@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return service.login(request);
    }
    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> me(Authentication authentication) {
        var userDetails = (UserDetails) authentication.getPrincipal();
        var dto = new UsuarioDTO(userDetails.getUsername(), userDetails.getAuthorities());
        return ResponseEntity.ok(dto);
    }
    @PostMapping("/register-empleado")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public AuthResponse registrarEmpleado(@RequestBody RegisterRequest request) {
        // Por seguridad, forzamos el rol a EMPLEADO
        request.setRol(Rol.EMPLEADO);
        return service.register(request);
    }

}

