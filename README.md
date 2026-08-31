# NexusGame 🎮

E-commerce de videojuegos desarrollado en **Java (Spring Boot)** para el backend y **HTML, CSS y JavaScript** para el frontend, que consume el backend a través de una API REST.

Este proyecto fue realizado para una materia del **tercer semestre** de la Tecnología en Desarrollo de Software en el Politécnico Colombiano Jaime Isaza Cadavid (PCJIC).

## 📌 ¿En qué consiste NexusGame?

NexusGame es una tienda en línea de videojuegos con dos frentes:

- **Vista de cliente:** catálogo de productos (videojuegos) con su plataforma, categoría, formato, precio, stock, descripción y género.
- **Panel de administración:** permite crear, editar, eliminar productos y gestionar el stock disponible.

El sistema también incluye **registro e inicio de sesión de usuarios**, con contraseñas cifradas (BCrypt) y validadas contra la base de datos.

> Aún no incluye pasarela de pagos ni carrito de compra/checkout funcional — por ahora el enfoque está en el catálogo, la autenticación y la administración de productos.

## 🗂️ Estructura del proyecto

```
Ecommer/
├── .gitignore
└── MyApi_Rest/                        # Backend (Spring Boot)
    ├── pom.xml
    └── src/main/
        ├── java/com/MyApi_Rest/
        │   ├── Config/                 # Seguridad, CORS, rutas web, datos iniciales
        │   ├── Controller/              # Endpoints REST (productos, autenticación)
        │   ├── Dto/                      # Objetos de transferencia (login/registro)
        │   ├── Model/                     # Entidades JPA (Producto, Usuario)
        │   ├── Repository/                 # Acceso a datos (Spring Data JPA)
        │   └── Service/                     # Lógica de autenticación de usuarios
        └── resources/
            ├── application.properties          # Configuración de la app y la BD
            └── static/                          # Frontend (HTML, CSS, JS) servido por Spring Boot
```

## 🛠️ Tecnologías utilizadas

- **Java** + **Spring Boot** — framework principal del backend.
- **Spring Security** — cifrado de contraseñas (BCrypt) y control de acceso a rutas.
- **Spring Data JPA / Hibernate** — persistencia y acceso a la base de datos.
- **MySQL** — base de datos relacional.
- **HTML, CSS y JavaScript** (sin frameworks) — frontend, servido como recurso estático desde el propio backend.
- **Maven** — gestión de dependencias y build del proyecto.

## ▶️ Cómo instalarlo y probarlo

**Requisitos previos:** tener instalado Java 17+, Maven (o usar el `mvnw` incluido) y MySQL corriendo localmente.

1. Clona el repositorio:
   ```
   git clone https://github.com/davison14-X/Ecommer.git
   cd Ecommer/MyApi_Rest
   ```
2. Asegúrate de tener MySQL corriendo en `localhost:3306` (la base de datos `nexusgames` se crea automáticamente si no existe).
3. Define la contraseña de tu base de datos como variable de entorno antes de ejecutar (reemplaza `tu_password`):
   ```
   set DB_PASSWORD=tu_password        # Windows (cmd)
   $env:DB_PASSWORD="tu_password"     # Windows (PowerShell)
   export DB_PASSWORD=tu_password     # Linux / macOS
   ```
4. Ejecuta el proyecto:
   ```
   ./mvnw spring-boot:run
   ```
5. Abre el navegador en:
   ```
   http://localhost:8080
   ```

## 📚 Conceptos aplicados

- **Arquitectura en capas**: separación clara entre `Controller`, `Service`, `Repository` y `Model`.
- **API REST**: endpoints para productos (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) y autenticación (`/api/auth/login`, `/api/auth/register`).
- **ORM con JPA/Hibernate**: mapeo de entidades Java a tablas de MySQL.
- **Cifrado de contraseñas** con BCrypt antes de guardarlas en la base de datos.
- **DTOs** para separar los datos que entran/salen de la API del modelo interno de la base de datos.
- **Configuración de CORS**, necesaria para que el frontend consuma la API sin restricciones del navegador.
- **Actualizaciones parciales** de recursos (`PATCH` para el stock de un producto) frente a actualizaciones completas (`PUT`).
- **Variables de entorno** para mantener credenciales sensibles fuera del código fuente.

## 👤 Autor

Desarrollado por **Davison** — estudiante de Tecnología en Desarrollo de Software, Politécnico Colombiano Jaime Isaza Cadavid (PCJIC).