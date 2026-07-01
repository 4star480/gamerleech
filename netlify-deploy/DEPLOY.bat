@echo off
cd /d "%~dp0"
echo Deploying GamerLeech to Netlify...
netlify deploy --prod --dir=. --message "v2 Discord Terms Refund mobile remodel"
if errorlevel 1 (
  echo.
  echo If not logged in, run: netlify login
  echo Then link site: netlify link
  echo Or drag this folder to https://app.netlify.com/
  pause
)
