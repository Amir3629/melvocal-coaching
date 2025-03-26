@echo off
echo ===================================================
echo Checking next.config.js and Rebuilding Project
echo ===================================================
echo.

echo Step 1: Checking next.config.js configuration...
findstr /C:"output: 'export'" next.config.js >nul
if %errorlevel% equ 0 (
    echo [✓] Static export is correctly configured.
) else (
    echo [✗] Static export configuration is missing or incorrect!
    echo Please ensure next.config.js contains: output: 'export'
)

echo.
echo Step 2: Checking for invalid options...
findstr /C:"experimental" next.config.js >nul
if %errorlevel% equ 0 (
    echo [!] Warning: 'experimental' configuration found in next.config.js.
    echo Please review and remove any invalid options.
) else (
    echo [✓] No experimental configuration found.
)

echo.
echo Step 3: Checking GitHub Pages configuration...
findstr /C:"basePath" next.config.js >nul
if %errorlevel% equ 0 (
    echo [✓] basePath configuration found.
) else (
    echo [✗] basePath configuration is missing!
    echo Please add: basePath: process.env.NODE_ENV === 'production' ? '/vocal-coaching' : ''
)

echo.
echo Step 4: Rebuilding the project...
echo This may take a few minutes...
npm run build
if %errorlevel% neq 0 (
    echo [✗] Build failed! Please check the error messages above.
    exit /b 1
) else (
    echo [✓] Build completed successfully.
)

echo.
echo ===================================================
echo Next Steps:
echo ===================================================
echo.
echo 1. Check the 'out' folder to ensure all files were generated correctly.
echo 2. Commit and push your changes:
echo    git add .
echo    git commit -m "Update configuration and rebuild"
echo    git push
echo.
echo ===================================================

echo.
echo Would you like to commit and push these changes now? (Y/N)
set /p confirm=
if /i "%confirm%"=="Y" (
    git add .
    git commit -m "Update configuration and rebuild"
    git push
    echo Changes committed and pushed.
) else (
    echo Changes not pushed. You can manually push them later.
) 