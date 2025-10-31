@echo off
echo 🚀 Starting TruthLens Frontend...
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔗 Admin Panel: http://localhost:3000/?admin=true
echo ================================================

cd frontend
call npm install
call npm start
