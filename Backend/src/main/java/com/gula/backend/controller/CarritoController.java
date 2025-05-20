package com.gula.backend.controller;

import com.gula.backend.model.CarritoItem;
import com.gula.backend.service.CarritoService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @GetMapping
    public List<CarritoItem> obtenerCarrito(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return carritoService.obtenerCarrito(email);
    }

    @PostMapping("/agregar")
    public void agregarItem(Authentication authentication,
                            @RequestParam Long hamburguesaId,
                            @RequestParam int cantidad) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        carritoService.agregarItem(email, hamburguesaId, cantidad);
    }

    @DeleteMapping("/vaciar")
    public void vaciarCarrito(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        carritoService.vaciarCarrito(email);
    }
}

