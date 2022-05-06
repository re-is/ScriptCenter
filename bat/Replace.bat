set "word=table"
set "str=C:\\Program Files\\Program"
call set "str=%str:\\=\%"

:: Eredmény: C:\Program Files\Program
echo %str%
