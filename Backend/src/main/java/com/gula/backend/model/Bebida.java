package com.gula.backend.model;

import jakarta.persistence.Entity;

@Entity
public class Bebida extends Producto {

    private Integer volumen; // en mililitros

    public Bebida() {
        super();
    }

    public Bebida(String nombre, String descripcion, double precio, String imagenUrl, Integer volumen) {
        super(nombre, descripcion, precio, imagenUrl);
        this.volumen = volumen;
    }

    public Integer getVolumen() {
        return volumen;
    }

    public void setVolumen(Integer volumen) {
        this.volumen = volumen;
    }
}
