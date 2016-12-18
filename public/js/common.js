$('body > header > img').click(function(){
    $(location).attr('href', '/');
})
$('nav > div:even').mouseover(function(){
    $(this).css("background-image", "none");
    $(this).css("background-color", "teal");
    $(this).css("color", "#fff");
})
$('nav > div:even').mouseout(function(){
    $(this).css("background-image", "url('../img/list_btn.png')");
    $(this).css("color", "#000");
})
$('nav > div:odd').mouseover(function(){
    $(this).css("background-image", "none");
    $(this).css("background-color", "e84747");
    $(this).css("color", "#fff");
})
$('nav > div:odd').mouseout(function(){
    $(this).css("background-image", "url('../img/list_btn.png')");
    $(this).css("color", "#000");
})
$("#b_nav").click(function(){
    $(location).attr('href', '/book_list');
})
$("#q_nav").click(function(){
    $(location).attr('href', '/qna');
})
$("#n_nav").click(function(){
    $(location).attr('href', '/notice');
})
$("#map_nav").click(function(){
    $(location).attr('href', '/map');
})
$("#r_nav").click(function(){
    $(location).attr('href', '/readingroom');
})

