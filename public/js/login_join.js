            
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

$("#id_put").click(function(){
    $("#id_put").val(' ');
})
$("#join_section > div > input[type='text']").click(function(){
    $(this).val(' ');
})
 

$('#login_form').submit(function(e) {
    e.preventDefault();
      $.ajax({
         type:'POST',
         url:'/login',
         dataType:'JSON',
         data:{
            id: $('#id').val(), 
            password: $('#pw').val()
         },
         error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
         },
         success : function(result){
            if(result['result'] == true){
                var cookieVal = $.cookie('id',result['u_no']);        
                $(function(){
                    alert("환영합니다. " + result['name'] +" 님");
                });
                $("#log1").css("display", "none");
                $("#log2").css("display", "block");
                $("#login_modal").css("display", "none");
            }else{
                $(function(){
                    alert("아이디나 비밀번호가 틀렸습니다.");
                });
            }
             
             
         }
    });
});

            