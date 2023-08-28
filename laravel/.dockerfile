FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory
WORKDIR /var/www/html

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Copy the application files into the container
COPY . .

# Run Composer install
RUN composer install

# Generate Laravel application key
RUN php artisan key:generate

# Expose port 8000
EXPOSE 8000

# Start the Laravel application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
