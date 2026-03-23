@echo off
set GIT="C:\Users\DELL\AppData\Local\GitHubDesktop\app-3.5.6\resources\app\git\cmd\git.exe"
%GIT% init
%GIT% add .
%GIT% commit -m "Initial commit for LexAI"
%GIT% branch -M main
%GIT% remote remove origin
%GIT% remote add origin https://github.com/Shubhmaniya/lexAI.git
%GIT% push -u origin main
