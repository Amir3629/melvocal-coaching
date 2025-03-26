@echo off
echo Committing and pushing changes...
git add .
git commit -m "Fix music player: dramatically improve disc carousel with significant overlapping and stronger visual effects"
git push
echo Done!
pause 