<?php
// Simple test script - no exec functions

echo "Test 1: PHP is working\n\n";

echo "Test 2: Current directory\n";
echo __DIR__ . "\n\n";

echo "Test 3: Parent directory\n";
echo dirname(__DIR__) . "\n\n";

echo "Test 4: .env file exists?\n";
$envFile = dirname(__DIR__) . '/.env';
echo file_exists($envFile) ? "YES" : "NO";
echo "\n\n";

echo "Test 5: composer.phar exists?\n";
$composerFile = dirname(__DIR__) . '/composer.phar';
echo file_exists($composerFile) ? "YES" : "NO";
echo "\n\n";

echo "Test 6: artisan exists?\n";
$artisanFile = dirname(__DIR__) . '/artisan';
echo file_exists($artisanFile) ? "YES" : "NO";
echo "\n\n";

echo "Test 7: vendor directory exists?\n";
$vendorDir = dirname(__DIR__) . '/vendor';
echo is_dir($vendorDir) ? "YES" : "NO";
echo "\n\n";

echo "Test 8: Disabled functions\n";
echo ini_get('disable_functions');
echo "\n\n";

echo "Test 9: PHP Version\n";
echo PHP_VERSION;
echo "\n\n";

echo "DONE";
