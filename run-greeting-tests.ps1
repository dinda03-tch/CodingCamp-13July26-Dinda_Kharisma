$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
Set-Location "c:\Users\MyPC One Pro K7\Documents\GitHub\CodingCamp-13July26-Dinda_Kharisma"
$installOutput = npm install 2>&1 | Out-String
$installOutput | Set-Content "install-output.txt"
$output = npx vitest --run tests/unit/greeting.test.js tests/property/greeting.property.test.js --reporter=verbose 2>&1 | Out-String
$output | Set-Content "test-output.txt"
Write-Host "TESTS DONE"
# Keep alive for process reader
Start-Sleep -Seconds 3
