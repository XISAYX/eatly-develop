FROM php:8.2-apache

# 1. Instalar dependencias del sistema, PHP, Node.js y NPM
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

# 2. Habilitar mod_rewrite para Laravel
RUN a2enmod rewrite

# 3. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 4. Copiar los archivos del proyecto
COPY . /var/www/html

# 5. Instalar dependencias de PHP y Composer
RUN composer install --no-dev --optimize-autoloader

# 6. Instalar dependencias de Node y compilar explícitamente el proyecto para generar el manifest
RUN npm install \
    && npm run build

# 7. Crear la base de datos SQLite y asignar permisos totales a Apache (www-data)
RUN mkdir -p /var/www/html/database /var/www/html/public/build \
    && touch /var/www/html/database/database.sqlite \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite

# 8. Apuntar Apache a la carpeta public de Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# 9. Exponer el puerto 80
EXPOSE 80

# 10. Comando de inicio: limpiar cachés, asegurar permisos y arrancar Apache
CMD php artisan config:clear \
    && php artisan cache:clear \
    && php artisan route:clear \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite \
    && apache2-foreground