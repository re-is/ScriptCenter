@echo off
for %%a in (d e f g h i j k l m n o p q r s t u v w x y z) do vol %%a: 2>nul |find "Windows_7" >nul && set drv=%%a:

start "" "%drv%\setup.exe"
