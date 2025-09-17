# E-commerce SAAS Manager - Auto-Update Setup

Your Electron app now has professional auto-update capabilities like Riot Games, Discord, and other modern desktop applications!

## 🎯 What's Included

### Auto-Update System
- ✅ **electron-updater** - Handles automatic updates
- ✅ **Update dialogs** - User-friendly notifications
- ✅ **Background downloads** - Non-intrusive updates
- ✅ **Restart prompts** - Like professional apps

### Professional Installer
- ✅ **Inno Setup script** - Windows installer generation
- ✅ **Start menu shortcuts** - Professional installation
- ✅ **Uninstaller** - Clean removal
- ✅ **Desktop shortcuts** - Optional user choice

### Update Server
- ✅ **Express server** - Ready-to-deploy update hosting
- ✅ **CORS support** - Electron compatibility
- ✅ **Security headers** - Production-ready
- ✅ **Health checks** - Monitoring support

## 🚀 Quick Start

### 1. Build Your First Release

```powershell
# Build the application
npm run dist

# This creates:
# - Windows installer (.exe)
# - Update metadata (latest.yml)
# - Delta update packages (.nupkg)
```

### 2. Set Up Update Server

```powershell
# Start local update server for testing
cd update-server-example
npm install
npm start

# Server runs on http://localhost:3001
```

### 3. Deploy Your App

```powershell
# Use the automated build script
.\build-and-deploy.ps1 -Version 1.0.1 -Deploy
```

## 📋 Release Workflow

When you want to release an update:

1. **Make your code changes**
2. **Update version**: Edit `package.json` version
3. **Build**: Run `npm run dist`  
4. **Deploy**: Upload files to your update server
5. **Users get notified automatically!**

## 🔧 Configuration

### Update Server URL

Edit `package.json` to point to your production server:

```json
{
  "build": {
    "publish": {
      "provider": "generic", 
      "url": "https://your-domain.com/updates/"
    }
  }
}
```

### App Details

Customize in `package.json` and `installer/setup.iss`:
- App name and description
- Company information
- Icons and branding
- Version numbers

## 🎨 Custom Icons

Replace these placeholder files with your branding:
- `assets/icon.ico` - Main app icon
- `assets/wizard-large.bmp` - Installer background
- `assets/wizard-small.bmp` - Installer header

## 🛡️ Security (Production)

### Code Signing (Recommended)

For production, get a code signing certificate to avoid Windows security warnings:

```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/certificate.p12",
      "certificatePassword": "env:CERTIFICATE_PASSWORD"
    }
  }
}
```

### HTTPS Only

Always serve updates over HTTPS in production.

## 🔍 Testing Auto-Updates

1. **Build version 1.0.0**: `npm run dist`
2. **Install the app** from `dist/`
3. **Update to 1.0.1**: Change version in `package.json`
4. **Build again**: `npm run dist` 
5. **Copy new files** to update server
6. **Open installed app** - You'll see update notification!

## 📁 File Structure

```
your-app/
├── dist/                          # Built installers
├── installer/setup.iss            # Inno Setup script  
├── update-server-example/         # Update hosting server
├── assets/                        # Icons and branding
├── build-and-deploy.ps1          # Automated build script
└── electron.js                   # Auto-update logic
```

## 🆘 Troubleshooting

### Common Issues
- **Updates not detected**: Check version format (semantic versioning)
- **CORS errors**: Ensure server allows cross-origin requests
- **File not found**: Verify `latest.yml` is accessible

### Debug Logs
Check `electron-main.log` for detailed auto-updater logs.

## 🎉 You're All Set!

Your app now has enterprise-grade auto-update capabilities. Users will love getting seamless updates just like their favorite applications!

Need help? Check the detailed guides in `update-server-example/README.md`.
