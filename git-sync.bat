@echo off


echo === Git Sync Start ===

:: Step 1: Pull remote changes
echo Pulling from GitHub...
git pull origin main

:: Step 2: Add local changes
echo Adding changes...
git add .

:: Step 3: Commit (with timestamp as message)
echo Committing changes...
git commit -m "Sync on %date% %time%" 

:: Step 4: Push to GitHub
echo Pushing to GitHub...
git push origin main

echo === Git Sync Complete ===
pause

