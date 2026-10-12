@echo off
echo ====================================
echo   AUTOMATIC GIT PUSH ROBOT TURNAMEN
echo ====================================

cd /d C:\robot-turnamen

git add .
git commit -m "Auto update %date% %time%"
git push origin main

echo ====================================
echo   SUCCESS! Kode berhasil di-push.
echo ====================================
pause