# Usamos PHP 8.2 con Apache como base
FROM php:8.2-apache

# Instalamos dependencias del sistema, Node.js y herramientas necesarias
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    gnupg

# Instalamos Node.js (versión 20.x) para compilar los assets de React / Inertia
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Habilitamos mod_rewrite de Apache para las rutas limpias de Laravel
RUN a2enmod rewrite

# Instalamos Composer globalmente
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# Copiamos todo el código de tu proyecto al contenedor
COPY . /var/www/html

# Damos permisos correctos a las carpetas de almacenamiento y caché de Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Apuntamos el DocumentRoot de Apache a la carpeta /public de Laravel
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Instalamos dependencias de PHP y dependencias de Node, luego compilamos el frontend
RUN composer install --no-dev --optimize-autoloader \
    && npm install \
    && npm run build

# Exponemos el puerto 80 para la web
EXPOSE 80