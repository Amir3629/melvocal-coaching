# PowerShell script to deploy Next.js site to GitHub Pages

# Make sure we're in the right directory
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green

# Create a temporary directory for the deployment
$tempDir = "temp-gh-pages"
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy the built files to the temporary directory
Write-Host "Copying built files to temporary directory..." -ForegroundColor Green
Copy-Item -Path "out\*" -Destination $tempDir -Recurse

# Create a .nojekyll file to bypass Jekyll processing
New-Item -ItemType File -Path "$tempDir\.nojekyll" | Out-Null

# Initialize git in the temporary directory
Set-Location $tempDir
git init
git checkout -b gh-pages

# Add all files in the directory
git add .

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Add the remote origin
git remote add origin https://github.com/Amir3629/melvocal-coaching.git

# Force push to the gh-pages branch
Write-Host "Pushing to gh-pages branch..." -ForegroundColor Green
git push -f origin gh-pages

# Clean up
Set-Location ..
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Your site should be live at: https://amir3629.github.io/melvocal-coaching/" -ForegroundColor Cyan 