// -------------------------------------------------------------------------------------------- //
// Index Page

// widget
// ------------------
// var link = document.createElement('link');
// link.setAttribute("rel", "stylesheet");
// link.setAttribute("type", "text/css");
// link.onload = ()=> console.log("onload css");
// link.setAttribute("href", '/stylesheets/style.css');
// document.getElementsByTagName("head")[0].appendChild(link);
$(document).ready(function () {
    /*--- left menu full ---*/
    $(' .menu-small').on("click", function () {
        $(".fixed-sidebar.left").addClass("open");
    });
    $('.closd-f-menu').on("click", function () {
        $(".fixed-sidebar.left").removeClass("open");
    });

    //--- user setting dropdown on topbar
    $('.user-img').on('click', function () {
        // toggleClass(): Thêm hoặc loại bỏ một hoặc nhiều class của thành phần.
        $('.user-setting').toggleClass("active");
    });

    $('.gap2 .container').on('click', function () {
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

    $('.top-area > .setting-area > .notification-status').on("click", function () {
        $('.notification-status .dropdowns').toggleClass("active");
    });

    // New submit post box
    $(".new-postbox").click(function () {
        $(".postoverlay").fadeIn(500);
    });
    $(".postoverlay").not(".new-postbox").click(function () {
        $(".postoverlay").fadeOut(500);
    });
    $("[type = submit]").click(function () {
        var post = $("textarea").val();
        $("<p class='post'>" + post + "</p>").appendTo("section");
    });

    //---- responsive header -> create menu jquery canvas
    if ($.isFunction($.fn.mmenu)) {
        $(function () {
            //	create the menus
            $('#menu').mmenu();
        });
    }

    // fetch api - status
    $(".index-page .post-btn").click(function () {
        var file_data = $('.index-page #imageUpload').prop('files')[0];
        var statusTitle = $('.index-page textarea.statusTitle').val()
        // console.log(statusTitle)
        // console.log(file_data)
        var form_data = new FormData();
        form_data.append('imageStatus', file_data);
        form_data.append('statusTitle', statusTitle);
        uploadImage(form_data)

        function uploadImage(form_data) {
           fetch('http://localhost:3000/', { // Your POST endpoint
                    method: 'POST',

                    body: form_data // This is your file object
                })
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        console.log("Đăng bài viết thành công")
                    }
                })
                .catch(e => console.log(e))
        }
    });
    //dashboardDepartment
    $(".dashboardDepartment .row img ").each(function (k, v) {
        v.onload = function () {
            $(this).parent().children('.loading').attr('display', 'none')
            $(this).parent().children('.loading').removeClass('d-flex')
            $(this).addClass('show-image')
        };
        v.onerror = () => {
            $(this).parent().children('.loading').attr('display', 'none')
            $(this).parent().children('.loading').removeClass('d-flex')
            $(this).addClass('show-image')
        }
        v.src = v.src;
    });

    // addDepartment
    $(".addDepartment").ready(()=>{
        $.ajaxSetup({
            traditional: true
        });
    
        var uppyDepartment = Uppy.Core({
                restrictions: {
                    maxFileSize: 3145728,
                    maxNumberOfFiles: 1,
                    minNumberOfFiles: 1,
                    allowedFileTypes: ["image/*"]
                }
            })
            .use(Dashboard, {
                trigger: '.addDepartment #register',
                inline: true,
                target: '.addDepartment #drag-drop-area',
                replaceTargetContent: true,
                showProgressDetails: true,
                note: 'Images and video only 1 file, up to 3MB',
                height: 300,
                metaFields: [{
                    id: 'caption',
                    name: 'Caption',
                    placeholder: 'describe what the image is about'
                }],
                hideUploadButton: true
            })
        uppyDepartment.on('file-added', (file) => {
            console.log(file);
            uppy.setFileMeta(file.meta.id, {
                caption: file.name
            });
        });
    
        uppyDepartment.use(Uppy.XHRUpload, {
    
            id: 'XHRUpload',
            endpoint: 'http://localhost:3000/upload-image',
            method: 'POST',
            formData: true,
            fieldName: 'my_fieldName',
            metaFields: ['caption'],
    
        });
    
        uppyDepartment.on('upload-success', (file, response) => {
            $('.addDepartment #urlImage').val(response.uploadURL)
            $(".addDepartment .register-form").submit()
        });
        $(".addDepartment #register").click(function () {
            uppyDepartment.upload()
        })
        $(".addDepartment .register-form").submit(e => {
            e.preventDefault();
            let department = []
            $(".addDepartment input:checkbox:checked").each(function () {
                department.push($(this).val());
            });
            let user = {
                username: $('.addDepartment #username').val(),
                pass: $('.addDepartment #pass').val(),
                re_pass: $('.addDepartment #re_pass').val(),
                name: $('.addDepartment #name').val(),
                maphong: $('.addDepartment #maphong').val(),
                urlImage: $('.addDepartment #urlImage').val(),
                department: department
            }
            $.post("", user)
                .done(function (res) {
                    if (res.success) {
                        $(".addDepartment .alert").removeClass("alert-danger")
                        $(".addDepartment .alert").addClass("alert-success")
                        $(".addDepartment .alert").text(res.mess)
                        $('.addDepartment #myCollapsible').collapse('show')
                        $('.addDepartment input').val("")
                        uppyDepartment.reset()
                    } else {
                        $(".addDepartment .alert").removeClass("alert-success")
                        $(".addDepartment .alert").addClass("alert-danger")
                        $(".addDepartment .alert").text(res.mess)
                        $('.addDepartment #myCollapsible').collapse('show')
    
                    }
                });
            $('.addDepartment input').on("keypress change ", () => {
                $('.addDepartment #myCollapsible').collapse('hide')
            })
        })
    })
   
});



// -------------------------------------------------------------------------------------------- //