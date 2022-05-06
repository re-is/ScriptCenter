:: Disable network adapter
@SET TASK=ENABLE
FOR /F "delims== tokens=2" %%i IN ('wmic nic where physicaladapter^=true get netenabled /value ^| find "NetEnabled"') DO @SET STATUS=%%i
IF %STATUS%==TRUE @SET TASK=DISABLE
WMIC PATH Win32_NetworkAdapter WHERE PhysicalAdapter=TRUE CALL %TASK%
