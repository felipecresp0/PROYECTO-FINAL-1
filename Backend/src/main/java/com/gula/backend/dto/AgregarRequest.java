package com.gula.backend.dto;

public class AgregarRequest {
    private Long hamburguesaId;
    private int cantidad;

    // Getters y Setters

    public Long getHamburguesaId() {
        return hamburguesaId;
    }

    public void setHamburguesaId(Long hamburguesaId) {
        this.hamburguesaId = hamburguesaId;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}

