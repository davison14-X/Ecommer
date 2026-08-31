package com.MyApi_Rest.Repository;

import com.MyApi_Rest.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByUsername(String username);

    Usuario findByEmail(String email);
}
