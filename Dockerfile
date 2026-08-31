FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl

RUN a2enmod rewrite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar todo el código del proyecto
COPY . /var/www/html

# Crear carpetas obligatorias y el archivo sqlite absoluto
RUN mkdir -p /var/www/html/public/build \
    && mkdir -p /var/www/html/database \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/storage/framework/cache \
    && touch /var/www/html/database/database.sqlite

# Copiar explícitamente el manifest por seguridad
COPY public/build/manifest.json /var/www/html/public/build/manifest.json

RUN composer install --no-dev --optimize-autoloader

# Asignar permisos totales a Apache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite

# Apuntar Apache a la carpeta public de Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80

# Forzar la ruta absoluta de SQLite mediante variable de entorno en runtime, limpiar caché y arrancar Apache
CMD export DB_DATABASE=/var/www/html/database/database.sqlite \
    && php artisan config:clear \
    && php artisan cache:clear \
    && php artisan route:clear \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite \
    && apache2-foreground