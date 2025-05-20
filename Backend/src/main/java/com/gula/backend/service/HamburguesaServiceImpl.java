package com.gula.backend.service;

import com.gula.backend.model.Hamburguesa;
import com.gula.backend.repository.HamburguesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HamburguesaServiceImpl implements HamburguesaService {

    private final HamburguesaRepository repo;

    public HamburguesaServiceImpl(HamburguesaRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Hamburguesa> listarTodas() {
        return repo.findAll();
    }

    @Override
    public Hamburguesa guardar(Hamburguesa h) {
        return repo.save(h);
    }

    @Override
    public Hamburguesa actualizar(Long id, Hamburguesa h) {
        Optional<Hamburguesa> existente = repo.findById(id);
        if (existente.isPresent()) {
            Hamburguesa hamb = existente.get();
            hamb.setNombre(h.getNombre());
            hamb.setDescripcion(h.getDescripcion());
            hamb.setPrecio(h.getPrecio());
            hamb.setImagenUrl(h.getImagenUrl());
            return repo.save(hamb);
        }
        return null;
    }

    @Override
    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}

