FROM php:8.2-apache

# Instalar dependencias del sistema y extensiones necesarias
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    nodejs \
    npm

# Habilitar mod_rewrite de Apache para Laravel
RUN a2enmod rewrite

# Instalar Composer globalmente
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar todo el código fuente al contenedor PRIMERO
COPY . /var/www/html

# Crear y asegurar permisos totales para la base de datos SQLite y storage
RUN mkdir -p /var/www/html/database /var/www/html/public/build \
    && touch /var/www/html/database/database.sqlite \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite

# Apuntar Apache a la carpeta public de Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Instalar dependencias de PHP
RUN composer install --no-dev --optimize-autoloader

# Instalar dependencias de Node y compilar el frontend asegurando la salida en public/build
RUN npm install
RUN npm run build

# Exponer el puerto 80 para la web
EXPOSE 80

# Comando de inicio: limpia cachés, ajusta permisos y arranca Apache
CMD php artisan config:clear \
    && php artisan cache:clear \
    && php artisan route:clear \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite \
    && apache2-foreground