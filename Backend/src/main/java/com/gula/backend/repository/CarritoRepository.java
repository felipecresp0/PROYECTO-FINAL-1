package com.gula.backend.repository;

import com.gula.backend.model.CarritoItem;
import com.gula.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarritoRepository extends JpaRepository<CarritoItem, Long> {
    List<CarritoItem> findByUsuario(Usuario usuario);
    void deleteByUsuario(Usuario usuario);
}

