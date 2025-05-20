package com.gula.backend.service;

import com.gula.backend.model.Hamburguesa;
import java.util.List;

public interface HamburguesaService {
    List<Hamburguesa> listarTodas();
    Hamburguesa guardar(Hamburguesa h);
    Hamburguesa actualizar(Long id, Hamburguesa h);
    void eliminar(Long id);
}

