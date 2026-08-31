package com.MyApi_Rest.Config;

import com.MyApi_Rest.Model.Producto;
import com.MyApi_Rest.Model.Usuario;
import com.MyApi_Rest.Repository.ProductoRepository;
import com.MyApi_Rest.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private ProductoRepository productoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedProducts();
    }

    private void seedAdmin() {
        String adminEmail = "admin@nexusgames.com";
        if (usuarioRepository.findByEmail(adminEmail) == null) {
            Usuario admin = new Usuario();
            admin.setEmail(adminEmail);
            admin.setUsername(adminEmail);
            admin.setNombre("Administrador");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            usuarioRepository.save(admin);
        }
    }

    private void seedProducts() {
        if (productoRepository.count() > 0) return;

        String img = "https://images.unsplash.com/photo-1657664042301-0f9ea2a9c3cd?w=600&q=80";

        productoRepository.save(build("God of War Ragnarök", "PS5", "Juego Físico", "Standard Edition", 180000, 45,
                "Acción-Aventura", "Continúa la épica saga nórdica de Kratos y Atreus. Gráficos next-gen, combate brutal y una narrativa cinematográfica sin igual.", img));
        productoRepository.save(build("God of War Ragnarök", "PS5", "Juego Físico", "Deluxe Edition", 240000, 18,
                "Acción-Aventura", "Edición especial con contenido adicional, artbook digital y banda sonora oficial.", img));
        productoRepository.save(build("Elden Ring", "PS5", "Juego Físico", "Standard Edition", 165000, 32,
                "RPG", "El RPG de mundo abierto de FromSoftware y George R.R. Martin. Explora Las Tierras Intermedias y conviértete en el Señor de Gracia.", img));
        productoRepository.save(build("Elden Ring", "PC", "Juego Digital", "Standard Edition", 130000, 99,
                "RPG", "Versión PC de Elden Ring vía Steam. Mundo vasto, jefes desafiantes y libertad total de exploración.", img));
        productoRepository.save(build("Forza Horizon 5", "Xbox Series X", "Juego Físico", "Standard Edition", 155000, 28,
                "Carreras", "El simulador de carreras más completo en México. Más de 500 autos, clima dinámico y el mapa más grande de la saga.", img));
        productoRepository.save(build("Forza Horizon 5", "Xbox Series X", "Juego Digital", "Ultimate Edition", 215000, 50,
                "Carreras", "Ultimate Edition incluye 2 años de Car Pass, VIP y todo el contenido adicional desde el lanzamiento.", img));
        productoRepository.save(build("The Legend of Zelda: TotK", "Nintendo Switch", "Juego Físico", "Standard Edition", 180000, 22,
                "Acción-Aventura", "Tears of the Kingdom. Explora Hyrule desde las profundidades hasta los cielos. Mecánicas de construcción revolucionarias.", img));
        productoRepository.save(build("Red Dead Redemption 2", "PC", "Juego Digital", "Standard Edition", 95000, 0,
                "Mundo Abierto", "La obra maestra de Rockstar Games. Vive la vida de Arthur Morgan en el ocaso del Viejo Oeste. Temporalmente agotado.", img));
    }

    private Producto build(String name, String platform, String category, String format,
                           double price, int stock, String genre, String description, String image) {
        Producto p = new Producto();
        p.setName(name);
        p.setPlatform(platform);
        p.setCategory(category);
        p.setFormat(format);
        p.setPrice(price);
        p.setStock(stock);
        p.setGenre(genre);
        p.setDescription(description);
        p.setImage(image);
        return p;
    }
}
