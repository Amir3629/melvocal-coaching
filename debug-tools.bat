@echo off
echo =============================================
echo Next.js Static Build Diagnostic Tools
echo =============================================
echo.

if "%1"=="" (
  echo Usage: debug-tools.bat [command]
  echo.
  echo Available commands:
  echo   analyze     - Run component analysis
  echo   build       - Run debug build with detailed output
  echo   full        - Run full analysis and build
  echo   browser     - Analyze browser console logs (requires log file path)
  echo.
  echo Examples:
  echo   debug-tools.bat analyze
  echo   debug-tools.bat build
  echo   debug-tools.bat full
  echo   debug-tools.bat browser browser-logs.json
  goto :EOF
)

if "%1"=="analyze" (
  echo Running component analysis...
  echo.
  call npm run analyze
  goto :EOF
)

if "%1"=="build" (
  echo Running debug build...
  echo.
  call npm run build:debug
  goto :EOF
)

if "%1"=="full" (
  echo Running full diagnosis (component analysis + debug build)...
  echo.
  call npm run debug:static
  goto :EOF
)

if "%1"=="browser" (
  if "%2"=="" (
    echo Error: Browser log analysis requires a file path
    echo Usage: debug-tools.bat browser browser-logs.json
    goto :EOF
  )
  
  echo Analyzing browser logs from %2...
  echo.
  call npm run debug:browser -- %2
  goto :EOF
)

echo Unknown command: %1
echo Run debug-tools.bat without arguments to see usage. 