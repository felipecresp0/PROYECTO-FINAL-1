package com.gula.backend.controller;

import com.gula.backend.model.Reserva;
import com.gula.backend.repository.ReservaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservas")
@CrossOrigin("*")
public class ReservaAdminController {

    private final ReservaRepository reservaRepository;

    public ReservaAdminController(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    // Listar todas las reservas
    @GetMapping
    public List<Reserva> obtenerTodasLasReservas() {
        return reservaRepository.findAll();
    }

    // Eliminar una reserva por ID
    @DeleteMapping("/{id}")
    public void eliminarReserva(@PathVariable Long id) {
        reservaRepository.deleteById(id);
    }
}
