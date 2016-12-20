$(document).ready(function(){
    var cookieVal = $.cookie('id');
    $.ajax({
        url: "/mypage"
        , type: "POST"
        , dataType: "JSON"
        , data : ({ no : cookieVal }),
        success: function(data){
            $("#mypage_id").append(data['userID']);
            $("#mypage_name").append(data['username']);
            $("#mypage_bookname").append(data['bookname']);
            $("#mypage_booklocation").append(data['bookloc']);
            $("#mypage_reading_seat").append(data['readingseat']);
        }
    });
});