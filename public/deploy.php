<?php

/**
 * Post-Deployment Script for Plesk Windows Server
 * Simple version - just runs composer install
 */

// Security: Require a secret token
$secretToken = 'YOUR_DEPLOY_TOKEN';

// Try to read token from .env file
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, 'DEPLOY_TOKEN=') === 0) {
            $secretToken = trim(substr($line, 13));
            break;
        }
    }
}

$providedToken = $_GET['token'] ?? '';

if (empty($providedToken) || $providedToken !== $secretToken) {
    http_response_code(403);
    die('Access denied. Invalid or missing token.');
}

// Increase limits
set_time_limit(600);
ini_set('max_execution_time', 600);

header('Content-Type: text/plain; charset=utf-8');

echo "========================================\n";
echo "Post-Deployment Script Started\n";
echo "========================================\n\n";

// Change to project root directory
$projectRoot = dirname(__DIR__);
chdir($projectRoot);
echo "Working directory: " . getcwd() . "\n\n";

// Check if composer.phar exists
if (!file_exists('composer.phar')) {
    echo "ERROR: composer.phar not found!\n";
    echo "Please ensure composer.phar is in the project root.\n";
    exit(1);
}

// Check if artisan exists
if (!file_exists('artisan')) {
    echo "ERROR: artisan not found!\n";
    exit(1);
}

echo "Files found: OK\n\n";

// Commands to run
$commands = [
    'Composer Install' => 'php composer.phar install --no-dev --no-interaction --prefer-dist --optimize-autoloader 2>&1',
    'Migrate Database' => 'php artisan migrate --force 2>&1',
    'Config Cache' => 'php artisan config:cache 2>&1',
    'Route Cache' => 'php artisan route:cache 2>&1',
    'View Cache' => 'php artisan view:cache 2>&1',
    'Storage Link' => 'php artisan storage:link 2>&1',
];

foreach ($commands as $name => $command) {
    echo ">>> {$name}\n";
    echo "Command: {$command}\n";
    
    $output = shell_exec($command);
    echo "Output:\n{$output}\n";
    echo "---\n\n";
    
    // Flush output
    if (ob_get_level()) ob_flush();
    flush();
}

echo "========================================\n";
echo "Deployment Complete!\n";
echo "========================================\n";
