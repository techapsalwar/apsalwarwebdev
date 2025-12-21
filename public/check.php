<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Laravel Diagnostic Check</h2>";
echo "<pre>";

// Check 1: vendor/autoload.php
$autoload = __DIR__ . '/../vendor/autoload.php';
echo "1. Checking: $autoload\n";
if (file_exists($autoload)) {
    echo "   ✓ vendor/autoload.php EXISTS\n";
} else {
    echo "   ✗ vendor/autoload.php NOT FOUND\n";
    die("STOP: vendor folder missing");
}

// Check 2: .env file
$envFile = __DIR__ . '/../.env';
echo "\n2. Checking: $envFile\n";
if (file_exists($envFile)) {
    echo "   ✓ .env file EXISTS\n";
} else {
    echo "   ✗ .env file NOT FOUND\n";
    die("STOP: .env file missing - create it!");
}

// Check 3: Try to load autoload
echo "\n3. Loading vendor/autoload.php...\n";
try {
    require $autoload;
    echo "   ✓ Autoload loaded successfully\n";
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n";
    die();
}

// Check 4: Check storage directories
echo "\n4. Checking storage directories...\n";
$storageDirs = [
    __DIR__ . '/../storage',
    __DIR__ . '/../storage/app',
    __DIR__ . '/../storage/framework',
    __DIR__ . '/../storage/framework/cache',
    __DIR__ . '/../storage/framework/sessions',
    __DIR__ . '/../storage/framework/views',
    __DIR__ . '/../storage/logs',
    __DIR__ . '/../bootstrap/cache',
];

foreach ($storageDirs as $dir) {
    $shortPath = str_replace(__DIR__ . '/..', '', $dir);
    if (is_dir($dir)) {
        if (is_writable($dir)) {
            echo "   ✓ $shortPath (writable)\n";
        } else {
            echo "   ✗ $shortPath (NOT writable)\n";
        }
    } else {
        echo "   ✗ $shortPath (MISSING)\n";
    }
}

// Check 5: Try to boot Laravel
echo "\n5. Trying to boot Laravel...\n";
try {
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    echo "   ✓ Laravel app created\n";
    
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    echo "   ✓ Kernel created\n";
    
    echo "\n<strong>SUCCESS: Laravel can boot!</strong>\n";
    echo "Try visiting the site again.\n";
    
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n";
    echo "\n   File: " . $e->getFile() . "\n";
    echo "   Line: " . $e->getLine() . "\n";
    echo "\n   Stack trace:\n";
    echo $e->getTraceAsString();
} catch (Error $e) {
    echo "   ✗ Fatal Error: " . $e->getMessage() . "\n";
    echo "\n   File: " . $e->getFile() . "\n";
    echo "   Line: " . $e->getLine() . "\n";
    echo "\n   Stack trace:\n";
    echo $e->getTraceAsString();
}

echo "</pre>";
