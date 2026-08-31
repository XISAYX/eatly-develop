FROM php:8.2-apache

# 1. Instalar dependencias del sistema y Node.js 20
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# 2. Habilitar mod_rewrite para Laravel
RUN a2enmod rewrite

# 3. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 4. Copiar los archivos del proyecto
COPY . /var/www/html

# 5. Instalar dependencias de PHP
RUN composer install --no-dev --optimize-autoloader

# 6. FORZAR la compilación de Node dentro del contenedor para generar el manifest.json
RUN rm -rf node_modules public/build \
    && npm install \
    && npm run build

# 7. Crear base de datos SQLite y asignar permisos totales a Apache
RUN mkdir -p /var/www/html/database \
    && touch /var/www/html/database/database.sqlite \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite

# 8. Apuntar Apache a la carpeta public de Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# 9. Exponer el puerto 80
EXPOSE 80

# 10. Limpiar cachés y arrancar Apache
CMD php artisan config:clear \
    && php artisan cache:clear \
    && php artisan route:clear \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite \
    && apache2-foreground