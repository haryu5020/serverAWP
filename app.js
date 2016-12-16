
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , renders = require('./routes/render')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io');

var app = express();

//좌석 변수
var seats = [
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


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


//For button


//For reading room
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


