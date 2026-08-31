package com.MyApi_Rest.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String plataforma;
    private String categoria;
    private String formato;
    private double precio;
    private int stock;
    @Column(length = 2000)
    private String descripcion;
    @Column(length = 2000)
    private String imagen;
    private String genero;

    public Producto() {}

    @JsonProperty("name")
    public String getName() { return nombre; }
    @JsonProperty("name")
    public void setName(String name) { this.nombre = name; }

    @JsonProperty("platform")
    public String getPlatform() { return plataforma; }
    @JsonProperty("platform")
    public void setPlatform(String platform) { this.plataforma = platform; }

    @JsonProperty("category")
    public String getCategory() { return categoria; }
    @JsonProperty("category")
    public void setCategory(String category) { this.categoria = category; }

    @JsonProperty("format")
    public String getFormat() { return formato; }
    @JsonProperty("format")
    public void setFormat(String format) { this.formato = format; }

    @JsonProperty("price")
    public double getPrice() { return precio; }
    @JsonProperty("price")
    public void setPrice(double price) { this.precio = price; }

    @JsonProperty("stock")
    public int getStock() { return stock; }
    @JsonProperty("stock")
    public void setStock(int stock) { this.stock = stock; }

    @JsonProperty("description")
    public String getDescription() { return descripcion; }
    @JsonProperty("description")
    public void setDescription(String description) { this.descripcion = description; }

    @JsonProperty("image")
    public String getImage() { return imagen; }
    @JsonProperty("image")
    public void setImage(String image) { this.imagen = image; }

    @JsonProperty("genre")
    public String getGenre() { return genero; }
    @JsonProperty("genre")
    public void setGenre(String genre) { this.genero = genre; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}
