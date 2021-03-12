
// -------------------------------------------------------------------------------------------- //
// Index Page

// widget-weather
var css_file=document.createElement("link"); 
var widgetUrl = location.href; 
css_file.setAttribute("rel","stylesheet"); 
css_file.setAttribute("type","text/css"); 
css_file.setAttribute("href",'https://s.bookcdn.com/css/w/booked-wzs-prime-vertical-one.css?v=0.0.1'); 
document.getElementsByTagName("head")[0].appendChild(css_file); 
function setWidgetData(data) { if(typeof(data) != 'undefined' && data.results.length > 0) {
    for(var i = 0; i < data.results.length; ++i) {

        var objMainBlock = document.getElementById('m-booked-vertical-one-prime-45326');

        if(objMainBlock !== null) {
            var copyBlock = document.getElementById('m-bookew-weather-copy-'+data.results[i].widget_type);
            objMainBlock.innerHTML = data.results[i].html_code;
            if(copyBlock !== null) objMainBlock.appendChild(copyBlock); 
        }
    } 
    } else {
    alert('data=undefined||data.results is empty'); 
    }
}
var widgetSrc = "https://widgets.booked.net/weather/info?action=get_weather_info;ver=6;cityID=18408;type=7;scode=124;ltid=3458;domid=;anc_id=90532;countday=undefined;cmetric=1;wlangID=33;color=137AE9;wwidth=216;header_color=ffffff;text_color=333333;link_color=08488D;border_form=1;footer_color=ffffff;footer_text_color=333333;transparent=0;v=0.0.1";

widgetSrc += ';ref=' + widgetUrl;

var weatherBookedScript = document.createElement("script"); 

weatherBookedScript.setAttribute("type", "text/javascript"); 

weatherBookedScript.src = widgetSrc; 

document.body.appendChild(weatherBookedScript)

$(document).ready(function() {
    /*--- left menu full ---*/
    $('.index-page .menu-small').on("click", function() {
        $(".index-page .fixed-sidebar.left").addClass("open");
    });
    $('.index-page .closd-f-menu').on("click", function() {
        $(".index-page .fixed-sidebar.left").removeClass("open");
    });

    //--- user setting dropdown on topbar
    $('.index-page .user-img').on('click', function() {
        // toggleClass(): Thêm hoặc loại bỏ một hoặc nhiều class của thành phần.
        $('.index-page .user-setting').toggleClass("active");
    });

    $('.index-page .gap2 .container').on('click', function() {
        // hide all when click index page
        $('.index-page .user-setting').removeClass("active");
        $(".index-page .fixed-sidebar.left").removeClass("open");
        $(".top-area > .setting-area > li > a").removeClass('active');
    });

    // top menu list
	$('.index-page .main-menu > span').on('click', function () {
        // slideToggle(): Hiển thị và ẩn các thành phần phù hợp với hiệu ứng chuyển động trượt (slide).
		$('.index-page .nav-list').slideToggle(300);
	});

    //------- Notifications Dropdowns
    // $('.top-area > .setting-area > li > a > ').on("click",function(){
    //     var $parent = $(this).parent('li');
    //     $(this).addClass('active').parent().siblings().children('a').removeClass('active');
    //     $parent.siblings().children('div').removeClass('active');
    //     $(this).siblings('div').toggleClass('active');
    //     return false;
    // });

    $('.index-page .top-area > .setting-area > .notification-status').on("click",function(){
        $('.index-page .notification-status .dropdowns').toggleClass("active");
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

            //	fire the plugin
            $('.mh-head.first').mhead({
                scroll: {
                    hide: 200
                }
            });
            $('.mh-head.second').mhead({
                scroll: false
            });
        });
    }
});



// -------------------------------------------------------------------------------------------- //