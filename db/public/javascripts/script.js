
$(document).ready(function(){
    $("#btn_closeWindow").click(function(){
        $(".par").hide();
    });
    $("#btn_openWindow").click(function(){
        $(".par").toggle();
    });
    $(".teacher_li").click(function () {
        $(this).parent().find("#delTeacher").toggle();
        $(this).parent().find("#changeTeacher").toggle();
    });
    });
