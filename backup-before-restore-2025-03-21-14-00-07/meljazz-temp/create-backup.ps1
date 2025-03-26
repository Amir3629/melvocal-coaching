# PowerShell script to create a backup of the vocal-coaching project

# Get current date and time for the backup filename
$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "vocal-coaching-backup-$date"
$backupDir = ".\backups"
$backupPath = "$backupDir\$backupName"

# Create backup directory if it doesn't exist
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
    Write-Host "Created backup directory: $backupDir"
}

# Create a new directory for this backup
New-Item -ItemType Directory -Path $backupPath
Write-Host "Created backup directory: $backupPath"

# Copy all files except node_modules, .git, .next, and out directories
Write-Host "Copying files to backup directory..."
Get-ChildItem -Path . -Exclude node_modules, .git, .next, out | Copy-Item -Destination $backupPath -Recurse -Force

# Copy the README file
Copy-Item -Path .\BACKUP_README.md -Destination "$backupPath\README.md" -Force

# Create a file with the current git commit hash
git rev-parse HEAD | Out-File -FilePath "$backupPath\current_commit_hash.txt"

# Create a ZIP file
Write-Host "Creating ZIP file..."
Compress-Archive -Path $backupPath -DestinationPath "$backupDir\$backupName.zip" -Force

# Remove the temporary directory
Remove-Item -Path $backupPath -Recurse -Force

Write-Host "Backup completed successfully!"
Write-Host "Backup file: $backupDir\$backupName.zip" 