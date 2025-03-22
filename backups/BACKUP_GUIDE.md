# Vocal Coaching Website - Backup and Restoration Guide

This document explains how to restore and manage backups of the Vocal Coaching Website project.

## What's in the Backup

The backup includes all essential project files and directories:

- `/app` - Core application code and components
- `/public` - Static assets and public files
- `/pages` - Page definitions (if using Pages Router)
- `/components` - UI components (if at root level)
- `/styles` - CSS and style files
- `/lib` - Library files and utilities
- `/utils` - Utility functions
- `/hooks` - Custom React hooks
- Configuration files (next.config.js, tailwind.config.js, etc.)
- Package files (package.json, package-lock.json)

Excluded from the backup:
- `node_modules` directory (can be regenerated with npm install)
- `.next` build directory (can be regenerated with npm run build)
- Temporary files and logs

## How to Restore a Backup

### Option 1: Using the Automated Restore Script

1. Place the backup ZIP file in a location on your computer
2. Extract the ZIP file to a new directory
3. Navigate to the extracted directory
4. Run the restore script:

```powershell
# On Windows:
.\restore-backup.ps1 -BackupPath "path\to\your\backup.zip" -DestinationPath "path\to\destination"

# On macOS/Linux:
bash ./restore-backup.sh "path/to/your/backup.zip" "path/to/destination"
```

### Option 2: Manual Restoration

1. Create a new directory for your project
2. Extract the ZIP file contents to this directory
3. Open a terminal/command prompt in the project directory
4. Install dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

## Starting the Website After Restoration

After restoring the backup:

1. Open a terminal in the project directory
2. Install dependencies (if not done during restoration):

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Access the website at http://localhost:3000

## Creating New Backups

You can create a new backup of your current project state using the provided script:

```powershell
# On Windows:
.\create-backup.ps1

# On macOS/Linux:
bash ./create-backup.sh
```

This will create a timestamped ZIP file in the `/backups` directory.

## Backup Naming Convention

Backups are named using the following format:

```
vocal-coaching-backup-YYYY-MM-DD-HH-MM-SS.zip
```

Where:
- YYYY: Year (4 digits)
- MM: Month (2 digits)
- DD: Day (2 digits)
- HH: Hour (2 digits, 24-hour format)
- MM: Minute (2 digits)
- SS: Second (2 digits)

## Troubleshooting

If you encounter issues after restoring a backup:

1. Ensure all dependencies are installed: `npm install`
2. Clear the Next.js cache: `npm run clean` or `rm -rf .next`
3. Rebuild the project: `npm run build`
4. Verify the correct Node.js version is installed (see package.json)
5. Check for any environment variables required (.env files)

If problems persist, refer to the project's specific documentation or contact the project maintainer. 