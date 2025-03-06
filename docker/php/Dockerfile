FROM php:8.2-fpm

# Installation des dépendances système et PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install zip pdo_mysql

# Installation de Node.js et npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Définir les permissions
RUN chown -R www-data:www-data /var/www/html \
    && usermod -u 1000 www-data \
    && groupmod -g 1000 www-data

USER www-data 