@echo off
cd /d "c:\Users\MyPC One Pro K7\Documents\GitHub\CodingCamp-13July26-Dinda_Kharisma"
where node > node-path.txt 2>&1
where npx >> node-path.txt 2>&1
exit /b 0
