FROM php:8.4-apache AS app

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    nodejs \
    npm \
    unzip \
    libzip-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql dom zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
RUN cp .env.example .env
RUN APP_KEY='base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' php artisan wayfinder:generate --with-form --no-interaction
RUN npm ci && WAYFINDER_DISABLED=1 npm run build

RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri -e 's!/var/www/!/var/www/html/public/!g' /etc/apache2/apache2.conf \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["apache2-foreground"]
