            
            $("#login").click(function(){
                $("#login_modal").css("display", "block");
            })
            $("#login_close").click(function(){
                $("#login_modal").css("display", "none");
            })
            $('#login_bottom > input:even, #join_bottom > input:even').mouseover(function(){
                $(this).css("background-image", "none");
                $(this).css("background-color", "teal");
                $(this).css("border", "0px");
                $(this).css("color", "#fff");
            })
            $('#login_bottom > input:even, #join_bottom > input:even').mouseout(function(){
                $(this).css("background-image", "url('../img/list_btn.png')");
                $(this).css("border", "1px solid #a6a6a6");
                $(this).css("color", "#000");
            })
            $('#login_bottom > input:odd, #join_bottom > input:odd').mouseover(function(){
                $(this).css("background-image", "none");
                $(this).css("background-color", "#e84747");
                $(this).css("border", "0px");
                $(this).css("color", "#fff");
            })
            $('#login_bottom > input:odd, #join_bottom > input:odd').mouseout(function(){
                $(this).css("background-image", "url('../img/list_btn.png')");
                $(this).css("border", "1px solid #a6a6a6");
                $(this).css("color", "#000");
            });
            $("#join").click(function(){
                $("#join_modal").css("display", "block");
            })
            $("#join_close").click(function(){
                $("#join_modal").css("display", "none");
            })
          
$("#login_btn").click(function(){


})

$("#id_put").click(function(){
    $("#id_put").val(' ');
})
$("#join_section > div > input[type='text']").click(function(){
    $(this).val(' ');
})
 

$('#login_form').submit(function() {
      $.ajax({
         type:'POST',
         url:'/login',
         data:{id: $('#id').val(), 
                 password: $('#password').val()},
         success:function(result){
            $("#join").attr("value", "마이페이지");
            $("#login").attr("value", "로그아웃");
            }
         });
});

            