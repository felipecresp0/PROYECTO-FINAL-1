package com.gula.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/admin/test")
    public String adminTest() {
        return "Hola ADMIN";
    }

    @GetMapping("/cliente/test")
    public String clienteTest() {
        return "Hola CLIENTE";
    }

    @GetMapping("/empleado/test")
    public String empleadoTest() {
        return "Hola EMPLEADO";
    }
}
