# Vocal Coaching Website Backup Instructions

This document provides instructions on how to backup and restore the Vocal Coaching website project.

## Backup Instructions

To create a backup of the project, run the following command in PowerShell:

```powershell
.\simple-backup.ps1
```

This will create a ZIP file in the `backups` directory with the current date and time in the filename, for example:
`backups\vocal-coaching-backup-2025-03-17_14-03-48.zip`

The backup includes:
- app directory (Next.js application code)
- public directory (static assets)
- styles directory (CSS files)
- components directory (React components)
- Configuration files (package.json, next.config.js, tsconfig.json, tailwind.config.js)
- A README file with information about the project
- The current Git commit hash

## Restore Instructions

To restore a backup, run the following command in PowerShell:

```powershell
.\restore-backup.ps1 -BackupFile ".\backups\vocal-coaching-backup-2025-03-17_14-03-48.zip"
```

Replace the filename with the actual backup file you want to restore.

The restore process will:
1. Extract the backup files to a temporary directory
2. Install dependencies using npm
3. Copy the files from the backup to the appropriate locations
4. Display the README file from the backup
5. Clean up temporary files

After restoring, you can run the development server:

```powershell
npm run dev
```

## Important Notes

- The backup does not include the `node_modules` directory, `.git` directory, `.next` directory, or `out` directory.
- When restoring, the script will install dependencies using npm, which will recreate the `node_modules` directory.
- The restore process will overwrite existing files, so make sure to backup any changes you want to keep before restoring.

## Troubleshooting

If you encounter any issues with the backup or restore process:

1. Make sure you have sufficient permissions to read/write files in the project directory.
2. Check that PowerShell is running with administrator privileges if needed.
3. Ensure that npm is installed and available in your PATH.
4. If the restore process fails, you can manually extract the backup ZIP file and copy the files to the appropriate locations. 