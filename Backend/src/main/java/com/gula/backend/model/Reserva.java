package com.gula.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String emailCliente;

    private Long restauranteId;

    private LocalDateTime fechaHora;

    // Getters y setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getEmailCliente() { return emailCliente; }

    public void setEmailCliente(String emailCliente) { this.emailCliente = emailCliente; }

    public Long getRestauranteId() { return restauranteId; }

    public void setRestauranteId(Long restauranteId) { this.restauranteId = restauranteId; }

    public LocalDateTime getFechaHora() { return fechaHora; }

    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
}

