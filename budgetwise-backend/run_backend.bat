@echo off
echo Starting BudgetWise Backend...
echo Ensure your MySQL is running and password is set in application.properties!
"C:\Users\mukes\maven\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
pause
