const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3002;

// 设置视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// MongoDB连接配置
const MONGODB_URI = 'mongodb://localhost:27017';
const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // 5秒超时
    connectTimeoutMS: 10000, // 10秒连接超时
    socketTimeoutMS: 45000, // 45秒socket超时
});

// 连接MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        // 测试连接
        await client.db().admin().ping();
        console.log('✅ 已连接到MongoDB');
    } catch (error) {
        console.error('❌ MongoDB连接失败:', error.message);
        console.error('请确保MongoDB服务正在运行');
    }
}

// 主页路由
app.get('/', async (req, res) => {
    try {
        // 检查MongoDB连接状态
        await client.db().admin().ping();
        
        const db = client.db();
        const adminDb = client.db().admin();
        const listResult = await adminDb.listDatabases();
        const databases = listResult.databases;
        
        res.render('index', { databases });
    } catch (error) {
        console.error('获取数据库列表失败:', error);
        let errorMessage = 'MongoDB连接失败';
        
        if (error.message.includes('Topology is closed')) {
            errorMessage = 'MongoDB服务未运行，请先启动MongoDB服务';
        } else if (error.message.includes('ECONNREFUSED')) {
            errorMessage = '无法连接到MongoDB，请检查服务是否启动';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'MongoDB连接超时，请检查服务状态';
        }
        
        res.render('index', { databases: [], error: errorMessage });
    }
});

// 查看数据库详情
app.get('/database/:dbName', async (req, res) => {
    try {
        const dbName = req.params.dbName;
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        
        res.render('database', { 
            dbName, 
            collections: collections.map(col => col.name)
        });
    } catch (error) {
        console.error('获取集合列表失败:', error);
        res.status(500).json({ error: error.message });
    }
});

// 查看集合数据
app.get('/database/:dbName/collection/:collectionName', async (req, res) => {
    try {
        const { dbName, collectionName } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // 获取文档总数
        const total = await collection.countDocuments();
        
        // 获取文档数据
        const documents = await collection
            .find({})
            .skip(skip)
            .limit(limit)
            .toArray();
        
        const totalPages = Math.ceil(total / limit);
        
        res.render('collection', {
            dbName,
            collectionName,
            documents,
            pagination: {
                currentPage: page,
                totalPages,
                total,
                limit,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('获取集合数据失败:', error);
        res.status(500).json({ error: error.message });
    }
});

// API路由 - 获取数据库统计信息
app.get('/api/database/:dbName/stats', async (req, res) => {
    try {
        const dbName = req.params.dbName;
        const db = client.db(dbName);
        const stats = await db.stats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 启动服务器
async function startServer() {
    await connectToMongoDB();
    
    app.listen(PORT, () => {
        console.log(`🚀 MongoDB查看器已启动`);
        console.log(`📱 访问地址: http://localhost:${PORT}`);
        console.log(`🔗 MongoDB连接: ${MONGODB_URI}`);
    });
}

// 优雅关闭
process.on('SIGINT', async () => {
    console.log('\n正在关闭服务器...');
    await client.close();
    process.exit(0);
});

startServer().catch(console.error);
