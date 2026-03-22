# ClawCity Launcher
# Abre una nueva ventana de PowerShell con la TUI de ClawCity
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$dir'; `$host.UI.RawUI.WindowTitle = 'ClawCity'; node src/main.js"
) -WorkingDirectory $dir
