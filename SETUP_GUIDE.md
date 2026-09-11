# 🚀 Guía de Instalación y Configuración del Proyecto Élégance Beauty Studio

Esta guía contiene todos los prerrequisitos, herramientas y pasos necesarios para descargar, configurar y ejecutar el proyecto completo (**Frontend React** + **Backend Spring Boot 3** + **Base de Datos MySQL** + **Azure AD MSAL**) en un equipo nuevo.

---

## 📋 1. Software y Herramientas Necesarias (Prerrequisitos)

| Herramienta | Versión Recomendada | Enlace / Instrucción |
| :--- | :--- | :--- |
| **Node.js** | v18 LTS o v20 LTS | [nodejs.org](https://nodejs.org/) |
| **pnpm** (o npm) | v8+ / v9+ | `npm install -g pnpm` |
| **Java JDK** | JDK 17 o JDK 21 | Eclipse Temurin / OpenJDK / Oracle JDK 17 |
| **Apache Maven** | v3.8+ | [maven.apache.org](https://maven.apache.org/) |
| **MySQL Server** | v8.0+ | Corriendo localmente en el puerto `3306` |
| **Git** | v2.x+ | [git-scm.com](https://git-scm.com/) |

---

## 🛢️ 2. Configuración de la Base de Datos (MySQL)

1. Abre tu cliente de base de datos preferido (MySQL Workbench, TablePlus, DBeaver o la consola de MySQL).
2. Ejecuta la sentencia SQL para crear la base de datos:
   ```sql
   CREATE DATABASE IF NOT EXISTS elegancebd;
   ```
3. **Poblado automático**: Al iniciar el servidor backend de Spring Boot por primera vez, la aplicación ejecutará automáticamente el componente `DataSeeder.java`, insertando los registros de servicios, estilistas, citas y clientes si la base de datos está vacía.

---

## ⚙️ 3. Clonar y Ejecutar el Backend (Spring Boot 3 REST API)

1. Abre la terminal y clona el repositorio backend:
   ```bash
   git clone https://github.com/renahc/elegance-backend.git
   cd elegance-backend
   ```

2. *(Opcional)* Si tu instancia local de MySQL tiene una contraseña configurada para el usuario `root`, ajusta las credenciales en `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/elegancebd?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
       username: root
       password: tu_password_aqui
   ```

3. Compila y ejecuta el servidor backend:
   ```bash
   mvn spring-boot:run
   ```

4. El servicio backend estará disponible en: **`http://localhost:8080`**
   * **Documentación interactiva Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 🎨 4. Clonar y Ejecutar el Frontend (React 19 + Vite + Azure AD)

1. Abre una nueva ventana de terminal y clona el repositorio del frontend:
   ```bash
   git clone https://github.com/renahc/elegance.git
   cd elegance
   ```

2. Instala todas las dependencias del proyecto:
   ```bash
   pnpm install
   # (o si utilizas npm: npm install)
   ```

3. Inicia el servidor de desarrollo Vite:
   ```bash
   pnpm dev
   # (o si utilizas npm: npm run dev)
   ```

4. Abre tu navegador web e ingresa a: **`http://localhost:5173`**

---

## 🔐 5. Autenticación y Credenciales de Azure AD (MSAL)

La integración con **Microsoft Azure AD (Microsoft Entra ID)** para Single Sign-On (SSO) está lista e integrada en el proyecto con los siguientes parámetros:

* **Tenant ID**: `ff064edc-07f4-448c-97e1-49da14c085f5`
* **Client ID**: `413ae20f-d59e-4b81-8864-97d5945f7d5f`
* **Redirect URI**: `http://localhost:5173`

---

## 🔗 Repositorios Oficiales en GitHub

* **Frontend**: [https://github.com/renahc/elegance.git](https://github.com/renahc/elegance.git)
* **Backend**: [https://github.com/renahc/elegance-backend.git](https://github.com/renahc/elegance-backend.git)
