# Clean up script to remove Git repositories from backup directories
Write-Host "Cleaning up Git repositories in backup directories..." -ForegroundColor Green

# List of directories to clean
$dirsToClean = @(
    "backup-before-restore-*",
    "meljazz-temp",
    "backups",
    "restore-temp",
    "current-backup-*",
    "clean_restore",
    "temp-gh-pages"
)

foreach ($dir in $dirsToClean) {
    $matchingDirs = Get-ChildItem -Path $dir -Directory -ErrorAction SilentlyContinue
    if ($matchingDirs) {
        foreach ($subDir in $matchingDirs) {
            $gitDir = Join-Path $subDir.FullName ".git"
            if (Test-Path $gitDir) {
                Write-Host "Removing Git repository from $($subDir.FullName)" -ForegroundColor Yellow
                Remove-Item -Path $gitDir -Recurse -Force
            }
            
            # Also check subdirectories recursively
            $nestedGitDirs = Get-ChildItem -Path $subDir.FullName -Recurse -Filter ".git" -Directory -ErrorAction SilentlyContinue
            foreach ($nestedGitDir in $nestedGitDirs) {
                Write-Host "Removing nested Git repository from $($nestedGitDir.FullName)" -ForegroundColor Yellow
                Remove-Item -Path $nestedGitDir.FullName -Recurse -Force
            }
        }
    }
}

# Also check for root level matches (for wildcard patterns)
foreach ($dir in $dirsToClean) {
    if ($dir -match "\*") {
        $matchingDirs = Get-ChildItem -Path "." -Directory -Filter $dir.Replace("*", "*") -ErrorAction SilentlyContinue
        foreach ($matchedDir in $matchingDirs) {
            $gitDir = Join-Path $matchedDir.FullName ".git"
            if (Test-Path $gitDir) {
                Write-Host "Removing Git repository from $($matchedDir.FullName)" -ForegroundColor Yellow
                Remove-Item -Path $gitDir -Recurse -Force
            }
            
            # Also check subdirectories recursively
            $nestedGitDirs = Get-ChildItem -Path $matchedDir.FullName -Recurse -Filter ".git" -Directory -ErrorAction SilentlyContinue
            foreach ($nestedGitDir in $nestedGitDirs) {
                Write-Host "Removing nested Git repository from $($nestedGitDir.FullName)" -ForegroundColor Yellow
                Remove-Item -Path $nestedGitDir.FullName -Recurse -Force
            }
        }
    }
}

Write-Host "Cleanup completed successfully." -ForegroundColor Green 