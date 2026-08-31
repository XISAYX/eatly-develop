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

# Copiar el código del proyecto al contenedor
COPY . /var/www/html

# Crear y asegurar permisos totales para la base de datos SQLite y carpetas de almacenamiento/caché
RUN mkdir -p /var/www/html/database \
    && touch /var/www/html/database/database.sqlite \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod 664 /var/www/html/database/database.sqlite

# Apuntar Apache a la carpeta public de Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Instalar dependencias de PHP y compilar el frontend con Vite de forma limpia
RUN composer install --no-dev --optimize-autoloader \
    && npm install \
    && npx vite build

# Exponer el puerto 80 para la web
EXPOSE 80

# Comando de inicio: limpia cachés, ajusta permisos y arranca Apache
CMD php artisan config:clear \
    && php artisan cache:clear \
    && php artisan route:clear \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod 664 /var/www/html/database/database.sqlite \
    && apache2-foreground