/**
 * http://usejsdoc.org/
 */
exports.main = function(req, res){
        res.render('main.html');
};

exports.readingRoom = function(req, res){
        res.render('reading_room.html');
};

exports.qna = function(req, res){
        res.render('question.html');
};

exports.notice = function(req, res){
        res.render('notice.html');
};

exports.book_list = function(req,res){
        res.render('book_list.html');
};
exports.map = function(req, res){
        res.render('map.html');
};
exports.bookDetailZero = function(req,res){
	res.render('book_detail_b000000000.html');
};
exports.bookDetailOne = function(req,res){
	res.render('book_detail_b000000001.html');
};
exports.bookDetailTwo = function(req,res){
	res.render('book_detail_b000000002.html');
};
exports.bookDetailThree = function(req,res){
	res.render('book_detail_b000000003.html');
};
exports.bookDetailFour = function(req,res){
	res.render('book_detail_b000000004.html');
};
exports.bookDetailFive = function(req,res){
	res.render('book_detail_b000000005.html');
};
exports.bookDetailSix = function(req,res){
	res.render('book_detail_b000000006.html');
};
