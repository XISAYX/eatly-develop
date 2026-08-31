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

# Copiar todo el código
COPY . /var/www/html

# GARANTIZAR que la carpeta public/build y el manifest existan dentro del contenedor
RUN mkdir -p /var/www/html/public/build \
    && mkdir -p /var/www/html/database

# Copiar explícitamente el manifest por si Git lo ignoró al desplegar
COPY public/build/manifest.json /var/www/html/public/build/manifest.json

RUN composer install --no-dev --optimize-autoloader

# Crear base de datos SQLite y asignar permisos totales a Apache
RUN touch /var/www/html/database/database.sqlite \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite

# Apuntar Apache a la carpeta public de Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80

CMD php artisan config:clear \
    && php artisan cache:clear \
    && php artisan route:clear \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public \
    && chmod 664 /var/www/html/database/database.sqlite \
    && apache2-foreground