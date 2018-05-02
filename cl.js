//引入模块
const fs = require('fs');
const http = require('http');
const path = require('path');
//设置请求头信息
const opt = {
        port: 8087,
        headers: {
            'accept': 'image/png'
        }
    }
    //向服务器发送请求
http.request(opt, res => {
    //判断响应头信息是否有content-type,以及是否是png图片格式
    if (res.headers['content-type'] && res.headers['content-type'].indexOf('png') !== -1) {
        let str = '';
        //当http.request执行完毕，就会调用那个匿名回调函数，然后将HTTP响应对象作为参数传递给它，这个HTTP响应对象是个事件发射器，根据Node文档，它可以发射包括data，end在内的很多事件，你注册的那些回调函数会在每次事件发生时被调用。
        //**绑定data监听事件，客户端的请求发出后，会触发data里的回调函数，将响应对象传递给chunk这个形参。此时的str就是服务器端响应过来的字符串格式的数据。
        res.on('data', chunk => {
            str += chunk

        });
        //监听结束，在这个事件的回调函数里执行输出
        res.on('end', () => {
            //将响应到的数据写入指定的文件夹
            //此处需要注意，要将字符串格式转为对象格式后再操作
            const obj = JSON.parse(str);
            for (let i in obj) {
                //服务端响应过来的数据是键值对的数据类型，追加路径时需要使用键名，所以使用for..in遍历
                //写入文件：追加文件路径+要写入的文件(需要转成buffer格式)。i:键名（图片名），obj[i]:键值（图片编码格式）
                fs.writeFileSync(path.join(__dirname, 'pic', i), new Buffer(obj[i]));

            }
        })
    }
}).end();