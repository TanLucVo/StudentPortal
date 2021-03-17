
// -------------------------------------------------------------------------------------------- //
// Index Page

// widget
// ------------------

$(document).ready(function() {
    /*--- left menu full ---*/
    $(' .menu-small').on("click", function() {
        $(".fixed-sidebar.left").addClass("open");
    });
    $('.closd-f-menu').on("click", function() {
        $(".fixed-sidebar.left").removeClass("open");
    });

    //--- user setting dropdown on topbar
    $('.user-img').on('click', function() {
        // toggleClass(): Thêm hoặc loại bỏ một hoặc nhiều class của thành phần.
        $('.user-setting').toggleClass("active");
    });

    $('.gap2 .container').on('click', function() {
        // hide all when click index page
        $('.user-setting').removeClass("active");
        $(".fixed-sidebar.left").removeClass("open");
        $(".top-area > .setting-area > li > a").removeClass('active');
    });

    // top menu list
	$('.main-menu > span').on('click', function () {
        // slideToggle(): Hiển thị và ẩn các thành phần phù hợp với hiệu ứng chuyển động trượt (slide).
		$('.nav-list').slideToggle(300);
	});

    //------- Notifications Dropdowns
    // $('.top-area > .setting-area > li > a > ').on("click",function(){
    //     var $parent = $(this).parent('li');
    //     $(this).addClass('active').parent().siblings().children('a').removeClass('active');
    //     $parent.siblings().children('div').removeClass('active');
    //     $(this).siblings('div').toggleClass('active');
    //     return false;
    // });

    $('.top-area > .setting-area > .notification-status').on("click",function(){
        $('.notification-status .dropdowns').toggleClass("active");
    });

    // New submit post box
	$(".new-postbox").click(function () {
	    $(".postoverlay").fadeIn(500);
	});
	$(".postoverlay").not(".new-postbox").click(function() {
	    $(".postoverlay").fadeOut(500);
	});
	$("[type = submit]").click(function () {
	    var post = $("textarea").val();
	    $("<p class='post'>" + post + "</p>").appendTo("section");
	});

    //---- responsive header -> create menu jquery canvas
    if ($.isFunction($.fn.mmenu)) {
        $(function() {
            //	create the menus
            $('#menu').mmenu();
        });
    }
});



// -------------------------------------------------------------------------------------------- //