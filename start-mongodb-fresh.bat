@echo off
echo 正在启动MongoDB (全新数据目录)...
echo.

REM 创建新的数据目录
set DATA_DIR=D:\mongodb-data
if not exist "%DATA_DIR%" (
    echo 创建新的数据目录: %DATA_DIR%
    mkdir "%DATA_DIR%"
)

REM 检查MongoDB是否已经在运行
netstat -an | findstr :27017 >nul
if %errorlevel% == 0 (
    echo MongoDB已经在运行中...
    echo 访问地址: http://localhost:27017
    pause
    exit /b
)

echo 启动MongoDB服务...
echo 数据目录: %DATA_DIR%
echo 端口: 27017
echo.

REM 启动MongoDB，使用新的数据目录
mongod --dbpath "%DATA_DIR%" --port 27017 --bind_ip 127.0.0.1

echo.
echo MongoDB已停止
pause
