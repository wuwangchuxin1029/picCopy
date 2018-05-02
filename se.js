//引入模块
const fs = require('fs');
const http = require('http');
const path = require('path');

//搭建服务器
http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        return
    }
    //判断请求头信息是否有accept以及图片的编码格式
    if (req.headers['accept'] && req.headers['accept'].indexOf('png') !== -1) {
        //读取图片文件目录信息
        fs.readdir('./static', (err, paths) => {
            let obj = {}; //设定一个空对象来存放图片的名称与路径
            if (err) {
                throw err
            }
            //遍历文件目录
            paths.forEach((file) => {
                //追加路径,pathname:每个文件的绝对路径
                const pathname = path.join(__dirname, 'static', file);
                //将读取到的图片的名称与编码格式追加到obj里
                obj[file] = fs.readFileSync(pathname);

            });
            res.writeHead(200, {
                    'content-type': 'image/png'
                })
                //end只接收buffer和string格式的数据，所以在向客户端传送数据时，要将obj转为字符串或buffer数据格式
            res.end(JSON.stringify(obj));
        })
    } else {
        res.writeHead(400);
        res.end();
    }
}).listen(8087);