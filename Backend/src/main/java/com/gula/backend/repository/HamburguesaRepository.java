package com.gula.backend.repository;

import com.gula.backend.model.Hamburguesa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HamburguesaRepository extends JpaRepository<Hamburguesa, Long> {
}
