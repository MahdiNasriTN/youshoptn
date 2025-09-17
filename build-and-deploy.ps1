# Build and Deploy Script for Auto-Updates

# This PowerShell script automates the build and deployment process
# Run this when you want to release a new version

param(
    [string]$Version = "",
    [string]$ServerPath = ".\update-server-example\updates\",
    [switch]$Deploy = $false
)

Write-Host "🚀 Auto-Update Build and Deploy Script" -ForegroundColor Cyan

# Check if version is provided
if (-not $Version) {
    Write-Host "❌ Please provide a version number" -ForegroundColor Red
    Write-Host "Usage: .\build-and-deploy.ps1 -Version 1.0.1 [-Deploy]" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Building version $Version..." -ForegroundColor Green

# Update package.json version
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$packageJson.version = $Version
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"

Write-Host "✅ Updated package.json to version $Version" -ForegroundColor Green

# Build the application
Write-Host "🔨 Building React app..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ React build failed" -ForegroundColor Red
    exit 1
}

Write-Host "📱 Building Electron distributables..." -ForegroundColor Yellow
npm run dist

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Electron build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# List generated files
Write-Host "📄 Generated files:" -ForegroundColor Cyan
Get-ChildItem "dist\" -Name | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }

if ($Deploy) {
    Write-Host "🚀 Deploying to update server..." -ForegroundColor Yellow
    
    # Create server updates directory if it doesn't exist
    if (-not (Test-Path $ServerPath)) {
        New-Item -ItemType Directory -Path $ServerPath -Force
        Write-Host "📁 Created updates directory: $ServerPath" -ForegroundColor Green
    }
    
    # Copy update files
    Copy-Item "dist\latest.yml" -Destination $ServerPath -Force
    Copy-Item "dist\*.exe" -Destination $ServerPath -Force
    Copy-Item "dist\*.nupkg" -Destination $ServerPath -Force
    
    Write-Host "✅ Files deployed to $ServerPath" -ForegroundColor Green
    
    # List deployed files
    Write-Host "📄 Deployed files:" -ForegroundColor Cyan
    Get-ChildItem $ServerPath -Name | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
}

Write-Host "🎉 Release $Version is ready!" -ForegroundColor Green

if (-not $Deploy) {
    Write-Host "💡 To deploy to update server, run:" -ForegroundColor Yellow
    Write-Host "   .\build-and-deploy.ps1 -Version $Version -Deploy" -ForegroundColor Yellow
}

Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Test the installer: dist\E-commerce-SAAS-Manager Setup $Version.exe" -ForegroundColor Gray
Write-Host "  2. Upload update files to your production server" -ForegroundColor Gray
Write-Host "  3. Users will automatically get notified of the update!" -ForegroundColor Gray
