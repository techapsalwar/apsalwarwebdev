#!/bin/bash
# =============================================================================
# Plesk Git Post-Deployment Script
# Army Public School Alwar - Laravel Application
# =============================================================================
#
# USAGE:
# Add this to Plesk Git "Additional deployment actions":
#   bash /dev.apsalwar.edu.in/plesk-deploy.sh
#
# Or copy the commands below directly into the Plesk Git settings.
# =============================================================================

set -e  # Exit on any error

echo "========================================"
echo "🚀 Starting post-deployment tasks..."
echo "========================================"
echo ""

# Navigate to the project directory
PROJECT_DIR="/dev.apsalwar.edu.in"
cd "$PROJECT_DIR" || { echo "❌ Failed to cd to $PROJECT_DIR"; exit 1; }

echo "📂 Working directory: $(pwd)"
echo ""

# -----------------------------------------------------------------------------
# 1. Install PHP dependencies (production)
# -----------------------------------------------------------------------------
echo "📦 Installing Composer dependencies..."
if [ -f "composer.phar" ]; then
    php composer.phar install --no-dev --no-interaction --prefer-dist --optimize-autoloader
elif command -v composer &> /dev/null; then
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
else
    echo "⚠️  Composer not found - please install dependencies manually"
fi
echo ""

# -----------------------------------------------------------------------------
# 2. Run database migrations
# -----------------------------------------------------------------------------
echo "🗄️  Running database migrations..."
php artisan migrate --force
echo ""

# -----------------------------------------------------------------------------
# 3. Clear old caches
# -----------------------------------------------------------------------------
echo "🧹 Clearing old caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
echo ""

# -----------------------------------------------------------------------------
# 4. Build production caches
# -----------------------------------------------------------------------------
echo "⚡ Building production caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache 2>/dev/null || true
php artisan icons:cache 2>/dev/null || true
echo ""

# -----------------------------------------------------------------------------
# 5. Create storage symlink (if not exists)
# -----------------------------------------------------------------------------
echo "🔗 Ensuring storage symlink..."
php artisan storage:link 2>/dev/null || echo "   Storage link already exists"
echo ""

# -----------------------------------------------------------------------------
# 6. Set correct permissions
# -----------------------------------------------------------------------------
echo "🔐 Setting file permissions..."
chmod -R 755 storage 2>/dev/null || true
chmod -R 755 bootstrap/cache 2>/dev/null || true
echo ""

# -----------------------------------------------------------------------------
# 7. Restart queue workers (if using queues)
# -----------------------------------------------------------------------------
echo "🔄 Restarting queue workers..."
php artisan queue:restart 2>/dev/null || echo "   No queue workers to restart"
echo ""

# -----------------------------------------------------------------------------
# Done!
# -----------------------------------------------------------------------------
echo "========================================"
echo "✅ Deployment completed successfully!"
echo "========================================"
echo ""
echo "🌐 Your site should now be live!"
echo ""
