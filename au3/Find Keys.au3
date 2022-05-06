#include <Misc.au3>

While 1

	sleep(10)

	For $i = 0 to 255

		Local $hexa_code = Hex($i)
		Local $character = Chr($i)

		If (_IsPressed($hexa_code)) Then ToolTip($character & @CRLF & @CRLF & "_IsPressed(" & $hexa_code & ")", 20, 20)

	Next

WEnd
