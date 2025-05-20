package com.gula.backend.model;

import jakarta.persistence.Entity;

@Entity
public class Hamburguesa extends Producto {

    public Hamburguesa() {
        super();
    }

    public Hamburguesa(String nombre, String descripcion, double precio, String imagenUrl) {
        super(nombre, descripcion, precio, imagenUrl);
    }

    // No necesitas redefinir atributos ni getters/setters
}
