@echo off
"C:\xampp\php\php.exe" -c "C:\xampp\php\php.ini" "%CD%\plugin.php" %1
rem pause
call install_plugin.bat