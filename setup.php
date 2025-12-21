<?php
/**
 * One-time setup script - Run via Plesk Scheduled Tasks
 * Path: C:\Inetpub\vhosts\apsalwar.edu.in\dev.apsalwar.edu.in\setup.php
 */

$baseDir = __DIR__;
$logFile = $baseDir . '/storage/logs/setup.log';

function logMsg($msg) {
    global $logFile;
    $time = date('Y-m-d H:i:s');
    $line = "[$time] $msg\n";
    echo $line;
    @file_put_contents($logFile, $line, FILE_APPEND);
}

logMsg("=== SETUP STARTED ===");
logMsg("Base directory: $baseDir");

// Find PHP executable
$phpPaths = [
    'C:\\Program Files (x86)\\Plesk\\Additional\\PleskPHP82\\php.exe',
    'C:\\Program Files (x86)\\Plesk\\Additional\\PleskPHP81\\php.exe',
    'C:\\Program Files (x86)\\Plesk\\Additional\\PleskPHP80\\php.exe',
];

$phpExe = null;
foreach ($phpPaths as $path) {
    if (file_exists($path)) {
        $phpExe = $path;
        break;
    }
}

if (!$phpExe) {
    logMsg("ERROR: PHP executable not found");
    exit(1);
}
logMsg("Using PHP: $phpExe");

// Check for composer.phar
$composerPhar = $baseDir . '/composer.phar';
if (!file_exists($composerPhar)) {
    logMsg("ERROR: composer.phar not found at $composerPhar");
    exit(1);
}
logMsg("Composer found: $composerPhar");

// Run composer install
logMsg("Running composer install...");
$cmd = "\"$phpExe\" \"$composerPhar\" install --no-dev --optimize-autoloader --no-interaction 2>&1";
logMsg("Command: $cmd");

chdir($baseDir);
$output = shell_exec($cmd);
logMsg("Composer output:\n$output");

// Check if vendor folder exists now
if (is_dir($baseDir . '/vendor')) {
    logMsg("SUCCESS: vendor folder created!");
} else {
    logMsg("WARNING: vendor folder not found after composer install");
}

// Copy .env if needed
if (!file_exists($baseDir . '/.env') && file_exists($baseDir . '/.env.production')) {
    copy($baseDir . '/.env.production', $baseDir . '/.env');
    logMsg("Copied .env.production to .env");
}

// Run artisan commands if vendor exists
if (is_dir($baseDir . '/vendor')) {
    logMsg("Running artisan commands...");
    
    $artisanCmds = [
        'key:generate --force',
        'config:cache',
        'route:cache',
        'view:cache',
        'migrate --force',
    ];
    
    foreach ($artisanCmds as $artisanCmd) {
        $cmd = "\"$phpExe\" \"$baseDir/artisan\" $artisanCmd 2>&1";
        logMsg("Running: php artisan $artisanCmd");
        $output = shell_exec($cmd);
        logMsg("Output: $output");
    }
}

logMsg("=== SETUP COMPLETED ===");
