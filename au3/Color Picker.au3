#include <GUIConstantsEx.au3>
#include <WindowsConstants.au3>

$_tick = 0
$_gui = GUICreate("Color Picker", 200, 120, -1, 10, $WS_SYSMENU)
$_t_label = GUICtrlCreateLabel("", 10, 10, 200, 100)
$_c_label = GUICtrlCreateLabel("", 140, 10, 45, 65)
GUISetState(@SW_SHOW, $_gui)

While 1
	; Tick növelés:
	$_tick += 1

	; Minden 2. tikken:
	If Mod($_tick, 2) == 0 Then
		Switch GUIGetMsg()
			Case $GUI_EVENT_CLOSE
				GUIDelete($_gui)
				Exit
		EndSwitch
	EndIf

	; Minden 30. tikken:
	If Mod($_tick, 30) == 0 Then
		; Absolute mouse pos:
		Opt("MouseCoordMode", 1)
		$_a_mp = MouseGetPos()

		; Relative in window:
		Opt("MouseCoordMode", 2)
		$_r_mp = MouseGetPos()

		; Get color:
		$_col = PixelGetColor($_a_mp[0], $_a_mp[1])

		$_text = ""
		$_text &= "Abs. pos: " & $_a_mp[0] & ", " & $_a_mp[1] & @LF
		$_text &= "Rel. pos: " & $_r_mp[0] & ", " & $_r_mp[1] & @LF & @LF
		$_text &= "Color: #" & StringRight(Hex($_col), 6)

		GUICtrlSetData($_t_label, $_text)
		GUICtrlSetBkColor($_c_label, $_col)
	EndIf
WEnd
