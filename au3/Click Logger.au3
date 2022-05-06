;--------------------------
; Klikk Logger | 21.11.23
;--------------------------
#include <MyAutoIt.au3>
#include <File.au3>
#include <GUIConstants.au3>

Func ReadClicks()

	Local $Active_title = "", $Writed_title = "", $Window[4], $RelPos[2], $Cursor_rel_pos = "", $Pressed = False, $Clicked = False, $auFile = (@DesktopDir & "\Clicks.au3"), $GUI, $INFO_LABEL, $INFO_COLOR, $CHECKBOX_ON_COLOR, $CHECKBOX_OUT_COLOR, $COMMENT_INPUT, $TIMER_INPUT, $CHECKBOX_DOUBLE

	; Ablak készítés:
	$GUI = GUICreate("Click Logger", 570, 90, (($ScreenSize[0] * 0.5) - 285), ($ScreenSize[1] - 125), BitXOR($GUI_SS_DEFAULT_GUI, $WS_MINIMIZEBOX))
	;------------------------------------------------------------------------------
	$INFO_LABEL = GUICtrlCreateLabel("Title" & @CRLF & "Relative + DPI Position", 5, 5, 400, 45)
	$INFO_COLOR = GUICtrlCreateLabel("", 410, 5, 70, 45, $WS_BORDER)
	$CHECKBOX_ON_COLOR = GUICtrlCreateButton("On Color", 485, 5, 80, 18)
	$CHECKBOX_OUT_COLOR = GUICtrlCreateButton("Out Color", 485, 30, 80, 18)
	;------------------------------------------------------------------------------
	$COMMENT_INPUT = GUICtrlCreateInput("", 5, 55, 400, 30)
	$TIMER_INPUT = GUICtrlCreateInput("200", 410, 55, 80, 30)
	$CHECKBOX_DOUBLE = GUICtrlCreateCheckbox("Dupla", 500, 55, 65, 30)
	;------------------------------------------------------------------------------
	GUICtrlSetFont($INFO_LABEL, 11)
	GUICtrlSetFont($COMMENT_INPUT, 11)
	GUICtrlSetFont($TIMER_INPUT, 11)
	GUISetBkColor(0xFFFFFF)
	WinSetOnTop($GUI, "", 1)
	GUISetState(@SW_SHOW)

	If FileExists($auFile) Then FileDelete($auFile)
	Sleep(500)
	FileWrite($auFile, ("#include <MyAutoIt.au3>" & @CRLF & @CRLF & "Func RunClicks()" & @CRLF & @CRLF & "	Local $window" & @CRLF & @CRLF))

	While 1
		Sleep(16)

		Local $_Event = False, $_title = "", $_color = "", $_click_type = "", $_click_index = 0, $_data = "", $_abs_pos[2]

		Switch GUIGetMsg()
		Case $GUI_EVENT_CLOSE
			GUIDelete($GUI)
			ExitLoop
		Case $CHECKBOX_ON_COLOR
			$_click_index = 5
			$_Event = True
		Case $CHECKBOX_OUT_COLOR
			$_click_index = 6
			$_Event = True
		EndSwitch

		;------- CTRL -------------------------------------------------------------------------------------------
		;--------------------------------------------------------------------------------------------------------
		If _IsPressed($KEYS_CTRL) Then

			$_title = WinGetTitle("[ACTIVE]")

			; Ezek átírása:
			If (($_title = "") Or ($_title = "Start menü") Or ($_title = "Keresés")) Then $_title = "Program Manager"

			; Ezeken kívül:
			If ((StringInStr($_title, "Click Logger") = 0) And (StringInStr($_title, "Sublime") = 0)) Then

				; Sárga háttérszín:
				If Not $Pressed Then
					GUISetBkColor(0xFFDD00)
					$Pressed = True
				EndIf

				$Active_title = $_title
				$Window = WinGetPos($Active_title)
				$RelPos = RelPosByAbs($Window, MouseGetPos())
				$Cursor_rel_pos = ($RelPos[0] & ", " & $RelPos[1])

				For $i = 1 To 4
					If _IsPressed(Hex($i)) Then $_click_index = $i
				Next

				$_Event = True

			ElseIf $Pressed Then
				GUISetBkColor(0xFFFFFF)
				$Pressed = False
			EndIf
		ElseIf $Pressed Then
			GUISetBkColor(0xFFFFFF)
			$Pressed = False
		EndIf
		;--------------------------------------------------------------------------------------------------------
		;------- CTRL -------------------------------------------------------------------------------------------

		If ($Active_title <> "") Then
			; Szín lekérése:
			$_abs_pos = AbsPosByRel($Window, $RelPos)
			$_color = ColorByAbsPos($_abs_pos)
			GUICtrlSetBkColor($INFO_COLOR, $_color)

			If $_Event Then
				If ($_click_index > 0) Then
					If Not $Clicked Then
						; Kattintáskor a Dupla lekérése:
						If (($_click_index < 5) And (GUICtrlRead($CHECKBOX_DOUBLE) = 1)) Then $_click_index = 3

						Switch $_click_index
						Case 1
							$_click_type = '"left"'
						Case 2
							$_click_type = '"right"'
						Case 3
							$_click_type = '"double"'
						Case 4
							$_click_type = '"middle"'
						EndSwitch

						; Új ablakcím megadása:
						If ($Writed_title <> $Active_title) Then
							$_data &= ('	;------------------------------------------------------------------------------>' & @CRLF)
							$_data &= ('	$window = Window("' & $Active_title & '")' & @CRLF)
							$Writed_title = $Active_title
						EndIf
						; Comment:
						If (GUICtrlRead($COMMENT_INPUT) <> "") Then $_data &= ("	; " & GUICtrlRead($COMMENT_INPUT) & @CRLF)
						; Click vagy szín írása:
						If ($_click_index < 5) Then
							$_data &= ('	Click($window, ' & GUICtrlRead($TIMER_INPUT) & ', ' & $Cursor_rel_pos & ', ' & $_click_type & ')' & @CRLF)
						ElseIf ($_click_index = 5) Then
							$_data &= ('	ColorOnAbsPos("' & $_color & '", AbsPosByRel($window, ' & $Cursor_rel_pos & '))' & @CRLF)
						ElseIf ($_click_index = 6) Then
							$_data &= ('	ColorOutAbsPos("' & $_color & '", AbsPosByRel($window, ' & $Cursor_rel_pos & '))' & @CRLF)
						EndIf

						FileWrite($auFile, $_data)
						GUICtrlSetData($COMMENT_INPUT, "")
						GUICtrlSetState($CHECKBOX_DOUBLE, $GUI_UNCHECKED)
						GUICtrlSetBkColor($INFO_COLOR, 0xFFFFFF)

						$Clicked = True
					EndIf
				ElseIf $Clicked Then
					$Clicked = False
				EndIf

				GUICtrlSetData($INFO_LABEL, ($Writed_title & @CRLF & $Cursor_rel_pos))

			ElseIf $Clicked Then
				$Clicked = False
			EndIf

		EndIf

	WEnd

	FileWrite($auFile, (@CRLF & "EndFunc" & @CRLF & @CRLF & "RunClicks()" & @CRLF))

EndFunc

ReadClicks()
