@echo off

REM Chạy Spring Boot backend
start cmd /k "cd backend && mvnw spring-boot:run"

REM Chạy React frontend
start cmd /k "cd frontend && npm run dev"
