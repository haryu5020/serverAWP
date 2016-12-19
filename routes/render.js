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
exports.book_detail = function(req,res){
	res.render('book_detail');
};