@echo off

reg add "HKCU\Software\teszt_kulcs" /v egyes_value /t REG_SZ /d value /f

reg add "HKCU\Software\teszt_kulcs" /v egyes_value /t REG_DWORD /d 1 /f

reg delete "HKCU\Software\teszt_kulcs" /f