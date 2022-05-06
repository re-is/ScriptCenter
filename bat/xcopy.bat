@echo off

xcopy /y "D:\folder\setup.exe" "C:\to_folder"

xcopy /y "D:\folder" "C:\to_folder"

xcopy "D:\from_folder" "C:\to_folder" /d /e /c /r /i /k /y
