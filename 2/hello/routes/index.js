/** 首页的响应逻辑 **/

exports.route = function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	// 如果已登录，返回保存在session的已登录信息
	if(req.session.username){
		res.end('欢迎，' + req.session.username);
	}
	// 否则返回提示
	else {
		res.end('未登录');
	}
}