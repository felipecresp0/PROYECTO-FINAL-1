package com.gula.backend.model;

import jakarta.persistence.Entity;

@Entity
public class Postre extends Producto {

    public Postre() {
        super();
    }

    public Postre(String nombre, String descripcion, double precio, String imagenUrl) {
        super(nombre, descripcion, precio, imagenUrl);
    }
}
