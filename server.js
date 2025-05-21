const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// 托管静态文件（HTML、CSS、JS）
app.use(express.static(path.join(__dirname)));

// 自然排序比较函数
function naturalCompare(a, b) {
    const ax = [], bx = [];
    
    a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
    b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
    
    while(ax.length && bx.length) {
        const an = ax.shift();
        const bn = bx.shift();
        const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if(nn) return nn;
    }
    
    return ax.length - bx.length;
}

// API：获取 video 文件夹中的 MP4 文件列表
app.get('/api/videos', async (req, res) => {
    try {
        const videoDir = path.join(__dirname, 'video');
        const files = await fs.readdir(videoDir);
        const mp4Files = files.filter(file => file.endsWith('.mp4'));
        // 使用自然排序
        mp4Files.sort(naturalCompare);
        res.json(mp4Files);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '无法读取视频文件夹' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});



// const express = require('express');
// const fs = require('fs').promises;
// const path = require('path');
// const app = express();
// const port = 3000;

// // 托管静态文件（HTML、CSS、JS）
// app.use(express.static(path.join(__dirname)));

// // API：获取 video 文件夹中的 MP4 文件列表
// app.get('/api/videos', async (req, res) => {
//     try {
//         const videoDir = path.join(__dirname, 'video');
//         const files = await fs.readdir(videoDir);
//         const mp4Files = files.filter(file => file.endsWith('.mp4'));
//         res.json(mp4Files);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: '无法读取视频文件夹' });
//     }
// });

// // 启动服务器
// app.listen(port, () => {
//     console.log(`服务器运行在 http://localhost:${port}`);
// });

