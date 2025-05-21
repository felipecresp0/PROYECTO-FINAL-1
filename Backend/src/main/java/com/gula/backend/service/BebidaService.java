package com.gula.backend.service;

import com.gula.backend.model.Bebida;
import com.gula.backend.repository.BebidaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BebidaService {

    private final BebidaRepository bebidaRepository;

    public BebidaService(BebidaRepository bebidaRepository) {
        this.bebidaRepository = bebidaRepository;
    }

    public List<Bebida> obtenerTodas() {
        return bebidaRepository.findAll();
    }
}
