package com.gula.backend.model;

import jakarta.persistence.Entity;

@Entity
public class Acompanante extends Producto {

    public Acompanante() {
        super();
    }

    public Acompanante(String nombre, String descripcion, double precio, String imagenUrl) {
        super(nombre, descripcion, precio, imagenUrl);
    }
}
