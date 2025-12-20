# Plesk Git Deployment Guide - APS Alwar School Website

This guide walks you through setting up GitHub Actions CI/CD with Plesk Git deployment.

## Why Plesk Git Deploy?

Your server has **Node.js 20.19.4** available, making Plesk Git the best option:
- ✅ Faster deployments (git pull vs full FTP upload)
- ✅ Automatic webhooks
- ✅ Easy rollback
- ✅ Native Plesk integration

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Push to main  │────▶│   Run Tests     │────▶│  Build Assets   │
│                 │     │   (Pest PHP)    │     │  (npm run build)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  App is Live!   │◀────│ Plesk runs      │◀────│  Push built     │
│                 │     │ deploy script   │     │  assets to repo │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Step 1: Configure GitHub Repository

### 1.1 Repository Settings

Go to **GitHub → Repository → Settings → Actions → General**:
- Under **Workflow permissions**: Select **"Read and write permissions"**
- Check **"Allow GitHub Actions to create and approve pull requests"**

This allows the workflow to push built assets back to the repository.

---

## Step 2: Set Up Plesk Git Deployment

### 2.1 Enable Git in Plesk

1. Log into **Plesk**
2. Go to **Websites & Domains** → Your domain (dev.apsalwar.edu.in)
3. Click **Git** (or search for "Git" in the sidebar)

### 2.2 Add Repository

1. Click **Add Repository** or **Clone Repository**
2. Fill in the details:
   - **Remote Git repository**: `https://github.com/YOUR_USERNAME/YOUR_REPO.git`
   - **Branch**: `main`
   - **Deployment mode**: Automatic
   - **Deploy to**: Leave as default (your web root `/dev.apsalwar.edu.in`)

### 2.3 Set Up Deploy Key (for private repos)

If your repository is **private**:

1. In Plesk Git settings, copy the **SSH Public Key**
2. Go to **GitHub → Repository → Settings → Deploy keys**
3. Click **Add deploy key**
4. Paste the key and give it a name
5. Enable **"Allow write access"** (optional)

### 2.4 Configure Webhook (Automatic Deployment)

In Plesk Git settings:
1. Copy the **Webhook URL** shown
2. Go to **GitHub → Repository → Settings → Webhooks**
3. Click **Add webhook**
4. Set:
   - **Payload URL**: Paste the Plesk webhook URL
   - **Content type**: `application/json`
   - **Secret**: Leave empty (or use Plesk's if provided)
   - **Events**: Select "Just the push event"

---

## Step 3: Add Post-Deployment Script

### Option A: Use the included script (Recommended)

In Plesk Git **"Additional deployment actions"** field, add:

```bash
bash /dev.apsalwar.edu.in/plesk-deploy.sh
```

The `plesk-deploy.sh` script is already included in this repository.

### Option B: Inline commands

If you prefer, paste these commands directly in Plesk:

```bash
cd /dev.apsalwar.edu.in

# Install dependencies
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader 2>&1

# Run migrations
php artisan migrate --force

# Clear and rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link
php artisan storage:link 2>/dev/null || true

echo "Deployment complete!"
```

---

## Step 4: Configure Plesk for Laravel

### 4.1 Set Document Root

1. Go to **Websites & Domains** → Your domain
2. Click **Hosting Settings**
3. Change **Document Root** to: `/dev.apsalwar.edu.in/public`

### 4.2 Disable Node.js App (Important!)

The "startup file `/dev.apsalwar.edu.in/app.js` not found" error appears because Plesk thinks you want a Node.js app. Fix it:

1. Go to **Websites & Domains** → **Node.js**
2. Click **Disable Node.js** for this domain

> **Note**: Laravel runs on PHP, not Node.js. Node.js is only needed during build (handled by GitHub Actions).

### 4.3 PHP Version & Settings

1. Go to **Websites & Domains** → **PHP Settings**
2. Select **PHP 8.2** or higher
3. Enable these extensions:
   - `mbstring`, `xml`, `ctype`, `json`, `bcmath`
   - `pdo_mysql`, `gd`, `zip`, `intl`, `fileinfo`

---

## Step 5: Upload .env File

### Via Plesk File Manager

1. Go to **Files** in Plesk
2. Navigate to `/dev.apsalwar.edu.in/`
3. Create a new file named `.env`
4. Paste this configuration (update values for your setup):

```env
APP_NAME="Army Public School Alwar"
APP_ENV=production
APP_KEY=base64:GENERATE_THIS_KEY
APP_DEBUG=false
APP_TIMEZONE=Asia/Kolkata
APP_URL=https://dev.apsalwar.edu.in

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error

# Database (get from Plesk → Databases)
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# Session & Cache
SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=database

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=mail.apsalwar.edu.in
MAIL_PORT=587
MAIL_USERNAME=noreply@apsalwar.edu.in
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@apsalwar.edu.in
MAIL_FROM_NAME="${APP_NAME}"

# Vite
VITE_APP_NAME="${APP_NAME}"
```

### Generate App Key

Run locally and paste into .env:
```powershell
php artisan key:generate --show
```

---

## Step 6: Database Setup

### Create Database in Plesk

1. Go to **Databases** in Plesk
2. Click **Add Database**
3. Set:
   - **Database name**: `apsalwar_db`
   - **Username**: `apsalwar_user`
   - **Password**: Strong password
4. Update `.env` with these credentials

---

## Step 7: Create Required Directories

Via **Plesk File Manager**, ensure these directories exist in `/dev.apsalwar.edu.in/`:

```
storage/
├── app/
│   └── public/
├── framework/
│   ├── cache/
│   │   └── data/
│   ├── sessions/
│   └── views/
└── logs/

bootstrap/
└── cache/
```

Set permissions to **755** for all these directories.

---

## Step 8: First Deployment

### Push your code

```powershell
git add .
git commit -m "Initial deployment setup"
git push origin main
```

GitHub Actions will:
1. ✅ Run tests
2. ✅ Build frontend assets (npm run build)
3. ✅ Commit built assets to repo
4. ✅ Trigger Plesk webhook
5. ✅ Plesk pulls changes
6. ✅ Post-deploy script runs (migrations, cache)

---

## Subsequent Deployments

Just push to main - everything is automatic:

```powershell
git add .
git commit -m "Your changes"
git push origin main
```

---

## Troubleshooting

### "Node.js startup file not found" Error

Go to **Plesk → Websites & Domains → Node.js** and **disable** Node.js for this domain. Laravel uses PHP, not Node.js at runtime.

### Webhook Not Triggering

1. Check webhook URL is correct in GitHub
2. Verify webhook secret matches (if using one)
3. Check GitHub → Repository → Settings → Webhooks → Recent Deliveries

### Build Assets Not Appearing

1. Check GitHub Actions completed successfully
2. Verify `public/build/` folder exists in repo after push
3. Check document root is set to `/dev.apsalwar.edu.in/public`

### Permission Errors

In Plesk File Manager, set:
- `storage/` → 755 (recursive)
- `bootstrap/cache/` → 755

### Database Connection Error

1. Verify `.env` has correct credentials
2. Check database exists in Plesk → Databases
3. Ensure MySQL user has proper permissions

---

## Files Reference

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | GitHub Actions workflow |
| `plesk-deploy.sh` | Post-deployment script for Plesk |
| `.env` | Production environment config (on server only) |

---

## Quick Checklist

- [ ] GitHub Actions workflow permissions set to "Read and write"
- [ ] Plesk Git repository connected
- [ ] Webhook configured in GitHub
- [ ] Post-deployment script added in Plesk
- [ ] Document root set to `/dev.apsalwar.edu.in/public`
- [ ] Node.js disabled in Plesk
- [ ] PHP 8.2+ selected with required extensions
- [ ] `.env` file uploaded with correct values
- [ ] Database created and credentials added to `.env`
- [ ] Storage directories created with 755 permissions

---

*Last Updated: December 19, 2025*
