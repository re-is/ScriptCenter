#include <GUIConstantsEx.au3>
#include <WinAPI.au3>

; Ablak beállítása:
$hGUI = GUICreate("VoluWheel", 300, 200)
GUISetFont(11)
GUICtrlCreateLabel("Hangerőszabályzás, egérgörgővel.", 10, 10)
GUISetFont(10)
GUICtrlCreateLabel("Automatikusan indul a rendszerrel.", 10, 50)
GUISetState(@SW_SHOW)

; DLL beállítása:
$hKey_Proc = DllCallbackRegister("mouse_proc", "int", "int;ptr;ptr")
$hM_Module = DllCall("kernel32.dll", "hwnd", "GetModuleHandle", "ptr", 0)
$hM_Hook = DllCall("user32.dll", "hwnd", "SetWindowsHookEx", "int", $WH_MOUSE_LL, "ptr", DllCallbackGetPtr($hKey_Proc), "hwnd", $hM_Module[0], "dword", 0)

; Tálca helyének lekérése:
$aPos = WinGetPos("[CLASS:Shell_TrayWnd]")
; Bal:
If $aPos[0] = 0 And $aPos[1] = 0 And $aPos[3] = @DesktopHeight Then
   ; --------
; Jobb:
ElseIf $aPos[0] > 0 And $aPos[1] = 0 And $aPos[3] = @DesktopHeight Then
   ; --------
; Fent:
ElseIf $aPos[0] = 0 And $aPos[1] = 0 And  $aPos[2] = @DesktopWidth Then
   ; --------
; Lent:
ElseIf $aPos[0] = 0 And $aPos[1] > 0 And  $aPos[2] = @DesktopWidth Then
   ; --------
EndIf

; Tálca-ikon beállítása:
Opt("TrayMenuMode", 3)
TraySetClick(1)
$RestoreTray = TrayCreateItem("Megnyitás")
$ExitTray = TrayCreateItem("Kilépés")

Func mouse_proc($nCode, $wParam, $lParam)
   Local $info, $mouseData
   If $nCode < 0 Then
      $ret = DllCall("user32.dll", "long", "CallNextHookEx", "hwnd", $hM_Hook[0], _
         "int", $nCode, "ptr", $wParam, "ptr", $lParam)
      Return $ret[0]
   EndIf

   $info = DllStructCreate("struct;int var1;byte var2;uint var3;char var4[128];endstruct;dword mouseData;dword flags;dword time;ulong_ptr dwExtraInfo", $lParam)
   $mouseData = DllStructGetData($info, 3)
   Select

   Case $wParam = 0x020A
   If _WinAPI_HiWord($mouseData) > 0 Then
      ;Wheel Up
      Send("{VOLUME_UP}")
   Else
      ;Wheel Down
      Send("{VOLUME_DOWN}")
   EndIf

   EndSelect

   $ret = DllCall("user32.dll", "long", "CallNextHookEx", "hwnd", $hM_Hook[0], _
      "int", $nCode, "ptr", $wParam, "ptr", $lParam)
   Return $ret[0]
EndFunc

Func on_exit()
   DllCall("user32.dll", "int", "UnhookWindowsHookEx", "hwnd", $hM_Hook[0])
   $hM_Hook[0] = 0
   DllCallbackFree($hKey_Proc)
   $hKey_Proc = 0
EndFunc

While 1

   ; Get window events:
   Switch GUIGetMsg()
   Case $GUI_EVENT_CLOSE
      on_exit()
      Exit
   Case $GUI_EVENT_MINIMIZE
      WinSetState($hGui, "", @SW_MINIMIZE)
      WinSetState($hGUI, "", @SW_HIDE)
   EndSwitch

   ; Get tray events:
   Switch TrayGetMsg()
   Case $RestoreTray
      WinSetState($hGui, "", @SW_MINIMIZE)
      WinSetState($hGui, "", @SW_RESTORE)
   Case $ExitTray
      GUIDelete($hGui)
      ExitLoop
   EndSwitch

WEnd
