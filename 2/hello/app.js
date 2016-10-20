const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

var sessionData = {};

const server = http.createServer((req, res) => {

	/** 如果请求的是静态资源目录，返回对应文件的内容 **/
	if (req.url.indexOf('/public/') == 0) {
		var fileName = '.' + req.url;
		// 浏览器请求时会带上上次返回的时间戳
		var ims = req.headers['if-modified-since'];
		// 判断文件是否存在
		fs.exists(fileName, (exists) => {
			if (exists) {
				// 文件存在，返回文件内容
				// 不同文件类型对应不同Content-Type，也就是MIME
				var type = 'text/plain';
				if (fileName.endsWith('.html')) {
					type = 'text/html';
				} else if (fileName.endsWith('.css')) {
					type = 'text/css';
				}
				res.setHeader('Content-Type', type);
				// 获取文件的时间戳，用于判断缓存是否需要更新
				var modifyTime = fs.statSync(fileName).mtime.toGMTString();
				res.setHeader('Last-Modified', modifyTime);
				// 比较修改时间，如果一样的话直接返回304
				if (ims == modifyTime) {
					res.statusCode = 304;
					res.end();
				}
				// 如果文件有更新，返回内容
				else {
					fs.readFile(fileName, (err, data) => {
						if (err) throw err;
						res.statusCode = 200;
						res.end(data);
					});
				}
			} else {
				//文件不存在，返回404
				res.statusCode = 404;
				res.setHeader('Content-Type', 'text/plain');
				res.end('404 Not Found');
			}
		});
		return;
	}


	/** 如果请求的是动态内容 **/
	// 还没seesionID的生成一个返回给浏览器
	var cookies = querystring.parse(req.headers['cookie']);
	var skey = cookies['skey'];
	if(!skey){
		// 生成全局唯一而且不容易被猜测的ID
		skey = 's-' + new Date().getTime() + '-' + Math.random();
		res.setHeader('Set-Cookie', 'skey=' + skey);
	}

	// 没有对应的session的新建一个
	if(!sessionData[skey]){
		sessionData[skey] = {};
	}

	// 获取当前请求对应的session
	req.session = sessionData[skey];

	// 路由转发
	// 登录
	if (req.url == '/login') {
		require('./routes/login').route(req, res);
		return;
	}
	// 首页
	if (req.url == '/' || req.url == '/index') {
		require('./routes/index').route(req, res);
		return;
	}


	/** 其他返回404 **/
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.end('404 Not Found');
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});