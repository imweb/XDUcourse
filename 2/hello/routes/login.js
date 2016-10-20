/** 登录的响应逻辑 **/

const querystring = require('querystring');

exports.route = function(req, res) {
	// 接收POST数据
	var bodyStr = '';
	req.addListener('data', (str) => {
		bodyStr += str;
	});
	req.addListener('end', (str) => {
		var body = querystring.parse(bodyStr);
		// 校验帐号密码
		if (body.username == 'sunxen' && body.password == '123') {
			// 记录当前登录用户名到session
			req.session.username = body.username;
			// 提示成功
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain; charset=utf-8');
			res.end('登录成功');
		} else {
			// 提示失败
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain; charset=utf-8');
			res.end('用户名或者密码错误');
		}
	});
}