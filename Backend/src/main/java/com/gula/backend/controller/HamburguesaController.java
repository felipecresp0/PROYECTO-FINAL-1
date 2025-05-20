package com.gula.backend.controller;

import com.gula.backend.model.Hamburguesa;
import com.gula.backend.service.HamburguesaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hamburguesas")
@CrossOrigin("*")
public class HamburguesaController {

    private final HamburguesaService service;

    public HamburguesaController(HamburguesaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Hamburguesa> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public Hamburguesa crear(@RequestBody Hamburguesa h) {
        return service.guardar(h);
    }

    @PutMapping("/{id}")
    public Hamburguesa actualizar(@PathVariable Long id, @RequestBody Hamburguesa h) {
        return service.actualizar(id, h);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
