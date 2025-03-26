# PowerShell script to restore a backup of the vocal-coaching project

param (
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

# Check if the backup file exists
if (-not (Test-Path $BackupFile)) {
    Write-Host "Error: Backup file not found: $BackupFile" -ForegroundColor Red
    exit 1
}

# Create a temporary directory for extraction
$tempDir = ".\temp_restore"
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Extract the backup
Write-Host "Extracting backup file: $BackupFile"
Expand-Archive -Path $BackupFile -DestinationPath $tempDir -Force

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Copy files from the backup
Write-Host "Restoring files from backup..."
if (Test-Path "$tempDir\app") {
    Remove-Item -Path .\app -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$tempDir\app" -Destination .\ -Recurse -Force
}

if (Test-Path "$tempDir\public") {
    Remove-Item -Path .\public -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$tempDir\public" -Destination .\ -Recurse -Force
}

if (Test-Path "$tempDir\styles") {
    Remove-Item -Path .\styles -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$tempDir\styles" -Destination .\ -Recurse -Force
}

if (Test-Path "$tempDir\components") {
    Remove-Item -Path .\components -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$tempDir\components" -Destination .\ -Recurse -Force
}

# Copy configuration files
if (Test-Path "$tempDir\package.json") {
    Copy-Item -Path "$tempDir\package.json" -Destination .\ -Force
}

if (Test-Path "$tempDir\next.config.js") {
    Copy-Item -Path "$tempDir\next.config.js" -Destination .\ -Force
}

if (Test-Path "$tempDir\tsconfig.json") {
    Copy-Item -Path "$tempDir\tsconfig.json" -Destination .\ -Force
}

if (Test-Path "$tempDir\tailwind.config.js") {
    Copy-Item -Path "$tempDir\tailwind.config.js" -Destination .\ -Force
}

# Display the README file if it exists
if (Test-Path "$tempDir\README_BACKUP.md") {
    Write-Host "`nBackup README:`n" -ForegroundColor Green
    Get-Content "$tempDir\README_BACKUP.md" | ForEach-Object { Write-Host $_ }
}

# Clean up
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "`nBackup restored successfully!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server." 