@echo off
echo 正在启动MongoDB Web查看器...
echo.

cd mongodb-viewer

echo 安装依赖包...
call npm install

echo.
echo 启动Web服务器...
echo 访问地址: http://localhost:3002
echo.

call npm start

pause
