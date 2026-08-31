package com.MyApi_Rest.Repository;

import com.MyApi_Rest.Model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository< Producto, Long> {
}
