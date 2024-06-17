@echo off
"C:\xampp\php\php.exe" -c "C:\xampp\php\php.ini" "%CD%\build.php" %1
rem pause
call release.bat