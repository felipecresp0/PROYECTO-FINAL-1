package com.gula.backend.controller;

import com.gula.backend.model.Bebida;
import com.gula.backend.model.Acompanante;
import com.gula.backend.model.Hamburguesa;
import com.gula.backend.model.Postre;
import com.gula.backend.repository.BebidaRepository;
import com.gula.backend.repository.AcompananteRepository;
import com.gula.backend.repository.PostreRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.gula.backend.repository.HamburguesaRepository;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private BebidaRepository bebidaRepository;

    @Autowired
    private AcompananteRepository acompananteRepository;

    @Autowired
    private PostreRepository postreRepository;

    @Autowired
    private HamburguesaRepository hamburguesaRepository;

    @GetMapping("/bebidas")
    public ResponseEntity<List<Bebida>> obtenerBebidas() {
        return ResponseEntity.ok(bebidaRepository.findAll());
    }

    @GetMapping("/acompanantes")
    public ResponseEntity<List<Acompanante>> obtenerAcompanantes() {
        return ResponseEntity.ok(acompananteRepository.findAll());
    }

    @GetMapping("/postres")
    public ResponseEntity<List<Postre>> obtenerPostres() {
        return ResponseEntity.ok(postreRepository.findAll());
    }
    @GetMapping("/hamburguesas")
    public ResponseEntity<List<Hamburguesa>> obtenerHamburguesas() {
        return ResponseEntity.ok(hamburguesaRepository.findAll());
    }

}
