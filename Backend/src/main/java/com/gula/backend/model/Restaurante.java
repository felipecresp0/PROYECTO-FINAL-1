package com.gula.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Restaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String direccion;
    private String codigoPostal;
    private double latitud;
    private double longitud;
    private String telefono;

    private java.time.LocalTime horarioApertura;
    private java.time.LocalTime horarioCierre;

    private int capacidad;

    private String imagenUrl; // NUEVO CAMPO
}
