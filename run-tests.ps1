Set-Location "c:\Users\MyPC One Pro K7\Documents\GitHub\CodingCamp-13July26-Dinda_Kharisma"
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
$output = npx vitest run --reporter=verbose 2>&1 | Out-String
$output | Set-Content "test-output.txt"
