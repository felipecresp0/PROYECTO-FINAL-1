package com.gula.backend.repository;

import com.gula.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByRestauranteId(Long restauranteId);
}

