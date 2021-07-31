$(function(){
    let baseDir=util.getParam("dir", ".");
    let isList=false;
    let init=function(isList){
        util.getResult(baseDir, function(data){
            let html=util.createHtml(data.files, isList);
            let guide=util.createGuide(data.rootDir);
            $(".header .title span").html(guide);
            $(".container").html(html);
            if(!isList){
                util.loadImage('.container img');
            }
        });
    };
    
    $(".header .switch").on("click", function(){
        $(this).html(isList?"缩略图显示":"列表显示");
        isList=!isList;
        init(isList);
    });
    
    $(window).on("scroll",function () {
        if(!isList){
            util.loadImage('.container img');
        }
    });
    
    init(isList);
});