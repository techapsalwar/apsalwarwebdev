<?php

/**
 * Post-Deployment Script for Plesk Windows Server
 * 
 * Run this after Git deployment by visiting:
 * https://dev.apsalwar.edu.in/deploy.php?token=YOUR_SECRET_TOKEN
 * 
 * IMPORTANT: Delete this file or restrict access after initial setup!
 */

// Security: Require a secret token
$secretToken = env('DEPLOY_TOKEN', 'CHANGE_THIS_TO_A_RANDOM_STRING');
$providedToken = $_GET['token'] ?? '';

if (empty($providedToken) || !hash_equals($secretToken, $providedToken)) {
    http_response_code(403);
    die('Access denied. Invalid or missing token.');
}

// Increase time limit for long-running commands
set_time_limit(300);
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Helper function to load Laravel's env
function env($key, $default = null) {
    static $env = null;
    if ($env === null) {
        $envFile = __DIR__ . '/../.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            $env = [];
            foreach ($lines as $line) {
                if (strpos($line, '#') === 0) continue;
                if (strpos($line, '=') !== false) {
                    list($name, $value) = explode('=', $line, 2);
                    $env[trim($name)] = trim($value, '"\'');
                }
            }
        }
    }
    return $env[$key] ?? $default;
}

header('Content-Type: text/plain; charset=utf-8');

echo "========================================\n";
echo "🚀 Post-Deployment Script Started\n";
echo "========================================\n\n";

// Change to project root directory
$projectRoot = dirname(__DIR__);
chdir($projectRoot);
echo "📂 Working directory: " . getcwd() . "\n\n";

// Commands to run
$commands = [
    'Install Composer Dependencies' => 'php composer.phar install --no-dev --no-interaction --prefer-dist --optimize-autoloader',
    'Run Migrations' => 'php artisan migrate --force',
    'Clear Config Cache' => 'php artisan config:clear',
    'Cache Config' => 'php artisan config:cache',
    'Clear Route Cache' => 'php artisan route:clear',
    'Cache Routes' => 'php artisan route:cache',
    'Clear View Cache' => 'php artisan view:clear',
    'Cache Views' => 'php artisan view:cache',
    'Create Storage Link' => 'php artisan storage:link',
];

$allSuccess = true;

foreach ($commands as $name => $command) {
    echo "▶ {$name}...\n";
    echo "  Command: {$command}\n";
    
    $output = [];
    $returnCode = 0;
    exec($command . ' 2>&1', $output, $returnCode);
    
    $outputText = implode("\n  ", $output);
    if ($outputText) {
        echo "  Output: {$outputText}\n";
    }
    
    if ($returnCode === 0) {
        echo "  ✅ Success\n\n";
    } else {
        echo "  ❌ Failed (exit code: {$returnCode})\n\n";
        $allSuccess = false;
    }
}

echo "========================================\n";
if ($allSuccess) {
    echo "✅ All deployment tasks completed successfully!\n";
} else {
    echo "⚠️ Some tasks failed. Check the output above.\n";
}
echo "========================================\n";
echo "\n🔒 Remember to add DEPLOY_TOKEN to your .env file!\n";
echo "   Or delete this file after setup is complete.\n";
