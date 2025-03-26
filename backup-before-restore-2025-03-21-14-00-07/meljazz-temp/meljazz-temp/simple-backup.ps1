# PowerShell script to create a backup of the vocal-coaching project

# Get current date and time for the backup filename
$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "vocal-coaching-backup-$date"
$backupDir = ".\backups"

# Create backup directory if it doesn't exist
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
    Write-Host "Created backup directory: $backupDir"
}

# Copy the README file to the root directory
Copy-Item -Path .\BACKUP_README.md -Destination .\README_BACKUP.md -Force

# Create a file with the current git commit hash
git rev-parse HEAD | Out-File -FilePath .\current_commit_hash.txt

# Create a ZIP file directly from the root directory
Write-Host "Creating ZIP file..."
Compress-Archive -Path .\app, .\public, .\styles, .\components, .\package.json, .\package-lock.json, .\next.config.js, .\tsconfig.json, .\README_BACKUP.md, .\current_commit_hash.txt, .\tailwind.config.js -DestinationPath "$backupDir\$backupName.zip" -Force

# Remove the temporary files
Remove-Item -Path .\README_BACKUP.md -Force
Remove-Item -Path .\current_commit_hash.txt -Force

Write-Host "Backup completed successfully!"
Write-Host "Backup file: $backupDir\$backupName.zip" 