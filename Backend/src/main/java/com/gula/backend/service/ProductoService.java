package com.gula.backend.service;

import com.gula.backend.model.Bebida;
import com.gula.backend.model.Acompanante;
import com.gula.backend.model.Postre;
import com.gula.backend.repository.AcompananteRepository;
import com.gula.backend.repository.BebidaRepository;
import com.gula.backend.repository.PostreRepository;
import com.gula.backend.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ProductoService {

    private final BebidaRepository bebidaRepository;
    private final AcompananteRepository acompananteRepository;
    private final PostreRepository postreRepository;

    public List<Bebida> obtenerBebidas() {
        return bebidaRepository.findAll();
    }

    public List<Acompanante> obtenerAcompanantes() {
        return acompananteRepository.findAll();
    }

    public List<Postre> obtenerPostres() {
        return postreRepository.findAll();
    }
}
