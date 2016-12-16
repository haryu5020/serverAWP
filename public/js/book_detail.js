$('#reserve_btn').click(function(){
    var list=$('#stock_place').text();
    var list_arr=list.split(',');

    var reserve_place=list_arr[0]; //제일 첫번째 도서가 예약됨.
    
    $("#stock_place").text(' ');
    for(var i=1;i<list_arr.length;i++){
        $('#stock_place').append(list_arr[i]);
        if(i!=list_arr.length-1){
            $('#stock_place').append(",");
        }
    }
})