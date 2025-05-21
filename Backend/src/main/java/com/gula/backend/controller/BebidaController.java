package com.gula.backend.controllers;

import com.gula.backend.model.Bebida;
import com.gula.backend.service.BebidaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bebidas")
@CrossOrigin(origins = "*")
public class BebidaController {

    private final BebidaService bebidaService;

    public BebidaController(BebidaService bebidaService) {
        this.bebidaService = bebidaService;
    }

    @GetMapping
    public List<Bebida> listarTodas() {
        return bebidaService.obtenerTodas();
    }
}
