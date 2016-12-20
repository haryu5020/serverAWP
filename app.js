
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
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , url = require('url')
  , session = require('express-session')
  , socketio = require('socket.io');
require('date-utils');



var app = express();

//좌석 변수
var seats = [
	[1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
	[1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
	[1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
	[1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
	[1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
	[1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
	[1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
	[1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1]
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
app.use(express.session({
	  key: 'sid', // 세션키
	  secret: 'secret', // 비밀키
	  cookie: {
	    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
	  }
}));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//Page rendering
app.get('/book_list',renders.book_list);
app.get('/readingroom', renders.readingRoom);
app.get('/qna', renders.qna);
app.get('/notice', renders.notice);
app.get('/map', renders.map);
app.get('/mypage', renders.mypage);
app.post('/mypage', function(req,res){
	var query = conn.query('SELECT u.u_id id, u.u_name uname, b.b_name bname, b.b_location bloc,rc.r_no num FROM USER u,BOOK b, BOOK_CHECKOUT bc, READINGROOM_CHECKOUT rc WHERE u.u_no = rc.u_no and u.u_no = bc.u_no and b.b_no = bc.b_no and u.u_no = ?',
			req.body.no ,function(err, result){
				if (err){
					console.error(err);
					throw err;
				}
				console.log(result);
				if(result.length === 0 ){
					var subquery1 = conn.query('SELECT u.u_id id, u.u_name name, rc.r_no num FROM USER u,READINGROOM_CHECKOUT rc WHERE u.u_no = rc.u_no and u.u_no = ?'
							,req.body.no, function(err, result1){
								if (err){
									console.error(err);
									throw err;
								}
								if( result1.length === 0 ){
									var subquery2 = conn.query('SELECT u_id, u_name FROM USER WHERE u_no = ?',req.body.no, function(err,results){
										if (err){
											console.error(err);
											throw err;
										}
										res.send({userID:results[0].u_id, username:results[0].u_name});
									});
								} else {
									var temp = result1[0].num;
									var str = temp.substring(8,10);
									res.send({userID:result1[0].u_id, username:result1[0].u_name, readingseat:str});
								}
							});
					}else{
					var temp = result[0].num;
					var str = temp.substring(8,10);
					res.send({userID:result[0].id, username:result[0].uname, bookname:result[0].bname, bookloc:result[0].bloc, readingseat:str });
					}
				});
});

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
	}
	else{
		console.log(req.cookies.auth);
	}
	res.render('main.html');
});


/* Join */
app.post('/join',function(req,res){
	var userid = req.body.join_id
	, userpw = req.body.join_password
	, confirm_userpw = req.body.join_repassword
	, username = req.body.join_name
	, useraddr = req.body.join_addr
	, userphone = req.body.join_phone;
	
	var subquery = conn.query('select u_no FROM USER ORDER BY u_no desc',function(err,result){
		if (err){
			console.error(err);
			throw err;
		}
		var str = result[0].u_no;
		var num = Number(str.substring(1));
		var new_u_num = num+1;
		var new_u_no = "u00000000" + new_u_num;
		
		var user_info = { 
				u_no : new_u_no,
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
});

/* Login */
app.post('/login',function(req, res){
	var id = req.body.id;
	var pw = req.body.password;
	var query = conn.query('SELECT count(*) cnt, u_name name, u_no from USER where u_id=? and u_password=?',[id,pw],function(err, rows){
		if(err){
			console.error(err);
			throw err;
		}
		console.log('rows', rows);
		
		var cnt = rows[0].cnt
		,	u_name = rows[0].name;
		
		if( cnt === 1 ){
			res.cookie('auth', true);
			res.send({result:true, name:u_name, u_no:rows[0].u_no});
		}else{
			res.send({result:false});
		}
	});
});

/* Log-out */
app.get('/logout',function(req, res){
	res.cookie('auth', false);
	res.redirect("/");
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
			res.send('<script>alert("원하는 책 데이터가 없습니다!");history.back();</script>');
			return;
		}
		else{
			res.render('book_detail_' + results[0].b_no + '.html');
		}
	});
});

/* Reading room */
app.get('/readingroom/seats',function(req,res){
	res.send(seats);
});



var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var io = socketio.listen(server);
io.sockets.on('connection',function(socket){
	socket.on('reserve',function(data){
		seats[data.y][data.x] = 2;
		var r_no = "r0000000"+data.y+""+data.x;
		var query1 = conn.query('UPDATE READINGROOM set r_checkout = "F" WHERE r_no = ?',r_no,function(err){
			if (err) {
				console.error(err);
				throw err;
			}
		});
		var checkout_info = {
				u_no : data.userid
				, r_no : r_no
				, r_c_date : new Date().toFormat("yyyy-MM-dd")
		};
		var query2 = conn.query('INSERT into READINGROOM_CHECKOUT set ?',checkout_info,function(err){
			if (err) {
				console.error(err);
				throw err;
			}
		});
		io.sockets.emit('reserver',data);
	});
});


