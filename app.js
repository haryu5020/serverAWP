
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , renders = require('./routes/render')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql')
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
});

// all environments
app.set('port', process.env.PORT || 18880);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
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

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//Page rendering
//app.get('/', renders.main);
app.get('/book_list',renders.book_list);
app.get('/readingroom', renders.readingRoom);
app.get('/qna', renders.qna);
app.get('/notice', renders.notice);
app.get('/map', renders.map);

app.get('/book_list/book_detail/0',renders.bookDetailZero);
app.get('/book_list/book_detail/1',renders.bookDetailOne);
app.get('/book_list/book_detail/2',renders.bookDetailTwo);
app.get('/book_list/book_detail/3',renders.bookDetailThree);
app.get('/book_list/book_detail/4',renders.bookDetailFour);
app.get('/book_list/book_detail/5',renders.bookDetailFive);
app.get('/book_list/book_detail/6',renders.bookDetailSix);


app.get('/',function(req,res){
	if(req.cookies.auth){
		console.log(req.cookies.auth);
		//쿠키 유지시 Login 없애고 logout 버튼
		//res.send('<script> document.getElementById("login").setAttribute("value", "로그아웃"); document.getElementById("join").setAttribute("value", "Mypage"); </script>');
	}
	else{
		console.log(req.cookies.auth);
		res.cookie("auth",false);
	}
	res.render("main.html");
});

/* Join */
app.post('/join',function(req,res){
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
});

/* Login */
//Session Check
app.get('/', function(req, res, next){
	
});

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
			res.cookie('auth', true);
			res.send('<script>alert("환영합니다. ");location.href = "/"; </script>');
		}else{
			res.send('<script>alert("아이디가 없거나 비밀번호가 틀렸습니다. ");location.href = "/"; </script>');
		}
	});
});

/* Log-out */
app.get('/logout',function(req, res, next){
	req.session.destroy(function(err){
		req.redirect('/');
	});
});

/* Search Part */
app.post('/search',function(req,res,next){
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
		else{
			res.render('book_detail_' + results[0].b_no + '.html');
		}
	});
});


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


