package com.MyApi_Rest.Controller;

import com.MyApi_Rest.Model.Producto;
import com.MyApi_Rest.Repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        producto.setId(null);
        return productoRepository.save(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto det) {
        return productoRepository.findById(id)
                .map(p -> {
                    p.setName(det.getName());
                    p.setPlatform(det.getPlatform());
                    p.setCategory(det.getCategory());
                    p.setFormat(det.getFormat());
                    p.setPrice(det.getPrice());
                    p.setStock(det.getStock());
                    p.setDescription(det.getDescription());
                    p.setImage(det.getImage());
                    p.setGenre(det.getGenre());
                    return ResponseEntity.ok(productoRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Producto> updateStock(@PathVariable Long id, @RequestBody StockUpdate body) {
        return productoRepository.findById(id)
                .map(p -> {
                    int qty = body.getQuantity() != null ? body.getQuantity() : 0;
                    if ("remove".equalsIgnoreCase(body.getAction())) {
                        p.setStock(Math.max(0, p.getStock() - qty));
                    } else {
                        p.setStock(p.getStock() + qty);
                    }
                    return ResponseEntity.ok(productoRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        if (!productoRepository.existsById(id)) return ResponseEntity.notFound().build();
        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public static class StockUpdate {
        private String action;
        private Integer quantity;
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
