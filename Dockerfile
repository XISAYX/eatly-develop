FROM php:8.2-apache

# Instalar dependencias del sistema, Node.js y npm nativos de Debian, y herramientas
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

# Directorio de trabajo
WORKDIR /var/www/html

# Copiar el código del proyecto
COPY . /var/www/html

# Permisos para almacenamiento y caché
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Apuntar Apache a la carpeta public de Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Instalar dependencias de PHP y compilar el frontend con npm
RUN composer install --no-dev --optimize-autoloader \
    && npm install \
    && npm run build

EXPOSE 80