@echo on

:: Activate Anaconda and the fact_env environment
CALL C:\ProgramData\anaconda3\Scripts\activate.bat
CALL conda activate fact_env

:: Start FastAPI backend
start cmd.exe /k "cd C:\Users\kaninidsvm\Desktop\apps\Fact-Analyzer\Fact-Analyzer-Platform\fact-check-ai_backend && uvicorn app:app --workers 4 --port 5767 --host 10.1.0.6"

:: Start React frontend
start cmd.exe /k "cd C:\Users\kaninidsvm\Desktop\apps\Fact-Analyzer\Fact-Analyzer-Platform\fact-check-ai_frontend && set PORT=5768 && npm start"
