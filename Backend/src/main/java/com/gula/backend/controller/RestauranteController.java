package com.gula.backend.controller;

import com.gula.backend.model.Restaurante;
import com.gula.backend.repository.RestauranteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurantes")
public class RestauranteController {

    @Autowired
    private RestauranteRepository restauranteRepository;

    @GetMapping
    public ResponseEntity<List<Restaurante>> obtenerTodos() {
        return ResponseEntity.ok(restauranteRepository.findAll());
    }
}
