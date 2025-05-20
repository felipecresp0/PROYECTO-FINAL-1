package com.gula.backend.service;

import com.gula.backend.model.CarritoItem;
import com.gula.backend.model.Usuario;
import com.gula.backend.repository.CarritoRepository;
import com.gula.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;

    public CarritoService(CarritoRepository carritoRepository, UsuarioRepository usuarioRepository) {
        this.carritoRepository = carritoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<CarritoItem> obtenerCarrito(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return carritoRepository.findByUsuario(usuario);
    }

    public void agregarItem(String email, Long hamburguesaId, int cantidad) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        CarritoItem item = new CarritoItem();
        item.setUsuario(usuario);
        item.setHamburguesaId(hamburguesaId);
        item.setCantidad(cantidad);
        carritoRepository.save(item);
    }

    public void vaciarCarrito(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        carritoRepository.deleteByUsuario(usuario);
    }
}

