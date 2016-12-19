
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , renders = require('./routes/render')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  //, mysql = require('mysql')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , url = require('url')
  , session = require('express-session')
  , socketio = require('socket.io');

var app = express();

//좌석 변수
var seats = [
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
];
/*
var conn = mysql.createConnection({
	host : '127.0.0.1' ,
	port : '3306' ,
	user : 'root' ,
	password : 'gkfb0724' ,
	database : 'AWP'
});
conn.connect(function(err){
	console.log('MYSQL Server connect');
	if (err) {
		console.error('MYSQL Connection Error');
		console.error(err);
		throw err;
	}
});*/


// all environments
app.set('port', process.env.PORT || 18880);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	key: 'sid',
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie : {
		maxAge : 1000 * 60 * 60 * 24	//쿠키 하루 유지
	}
}));
app.use(passport.initialize());
app.use(passport.session());


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//Page rendering
app.get('/', renders.main);
app.get('/book_list',renders.book_list);
app.get('/readingroom', renders.readingRoom);
app.get('/qna', renders.qna);
app.get('/notice', renders.notice);
app.get('/map', renders.map);


/* Join */
/*app.post('/join',function(req,res){
	var userid = req.body.join_id
	, userpw = req.body.join_password
	, confirm_userpw = req.body.join_repassword
	, username = req.body.join_name
	, useraddr = req.body.join_addr
	, userphone = req.body.join_phone;
	
	var user_info = { 
			u_id : userid,
			u_password : userpw,
			u_name : username,
			u_addr : useraddr,
			u_phone : userphone
	};
	if(userid !== "" && userpw !=="" && userpw === confirm_userpw){	
		var query = conn.query('insert into USER set ?',user_info,function(err,result){
		if (err){
			console.error(err);
			throw err;
		}
		res.send('<script>alert("회원가입이 완료되었습니다. 로그인하세요.");location.href="/";</script>');
		});
	}
});*/

/* Login */
//Session Check
app.get('/', function(req, res, next){
	if(req.cookies.auth){
		//쿠키 유지시 Login 없애고 logout 버튼
	}
	else{
		res.cookies.set("auth",false);
	}
});
/*
app.post('/login',function(req, res){
	var id = req.body.id;
	var pw = req.body.password;
	
	var query = conn.query('SELECT count(*) cnt from USER where u_id=? and u_password=?',[id,pw],function(err, rows){
		if(err){
			console.error(err);
			throw err;
		}
		console.log('rows', rows);
		var cnt = rows[0].cnt;
		if( cnt === 1 ){
			res.cookies.set("auth",true);
			res.send('<script>alert("환영합니다. ");location.href = "/";
            $("#join").attr("value", "마이페이지");
            $("#login").attr("value", "로그아웃");
            </script>');
		}else{
			res.send('<script>alert("아이디가 없거나 비밀번호가 틀렸습니다. ");location.href = "/"; </script>');
		}
	});
});*/

/* Log-out */
app.get('/logout',function(req, res, next){
	req.session.destroy(function(err){
		req.logout();
		req.redirect('/');
	});
});

/* Search Part */
/*app.post('/search',function(req,res,next){
	var searchWord = req.body.searchWord;	
	
	var query = conn.query('SELECT b_no FROM BOOK WHERE b_name = ?',searchWord,function(err,results){
		if (err) {
			console.error(err);
			throw err;
		}
		if(results.length === 0){
			res.status(404).send({msg : 'NOT FOUND'});
			return;
		}
	});
});
*/

/* Reading room */
app.get('/readingroom/seats',function(req,res,next){
	res.send(seats);
});


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socketio.listen(server);
io.sockets.on('connection',function(socket){
	socket.on('reserve',function(data){
		seats[data.y][data.x] = 2;
		io.sockets.emit('reserver',data);
	});
});


