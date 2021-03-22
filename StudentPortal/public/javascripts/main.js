// -------------------------------------------------------------------------------------------- //
// Index Page

// getLikeStatus
function getLikeStatus(element) {
    const idStatus = element.dataset.id
    $(document).ready(function () {
        fetch(`http://localhost:3000/status/${idStatus}`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.Status)
            if (data.Status.like === undefined) {

            }
            else {
                
            }
        })
    })
}

$(document).ready(function () {
    const socket =io()
    socket.on('connect', handleConnectionSuccess);
    socket.on('disconnect', () => {
        console.log("Mat ket noi voi server");
    });
    socket.on('list-users', handleUserList);
    socket.on('add-notification', (data)=> {
        $("#getNotification strong").text(data.department +" Đã đăng một thông báo")
        $("#getNotification small").text(Math.floor((Date.now() - data.createAt) / 1000) +" giây trước")
        $("#getNotification .toast-body").text(data.title)
        $(".toast").toast('show')
    });
    function handleUserList(user){
        console.log(user)
    }
    function handleConnectionSuccess(){
        console.log("da ket noi thanh cong voi id"+socket.id);
        let userId = '<%= user.id %>'
        socket.emit('register-id', {socketId:socket.id,userId:userId }) //gui id qua cho server
    }
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
    $(".index-page .post-btn").click(e => {
        var file_data = $('.index-page #imageUpload').prop('files')[0];
        var statusTitle = $('.index-page textarea.statusTitle').val()
        // console.log(statusTitle)
        // console.log(file_data)
        var form_data = new FormData();
        userId = e.target.dataset.userId
        image = e.target.dataset.image
        fullName = e.target.dataset.name
        var user = {
            userId: userId,
            image: image,
            fullName: fullName
        }
        if (statusTitle.length === 0) {
            alert("Vui lòng nhập tiêu đề bài đăng")
        }
        else {
            form_data.append('imageStatus', file_data);
            form_data.append('statusTitle', statusTitle);
            form_data.append('author', JSON.stringify(user))
            uploadImage(form_data)
        }
        function uploadImage(form_data) {
           fetch('http://localhost:3000/', { // Your POST endpoint
                    method: 'POST',

                    body: form_data // This is your file object
                })
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        author = JSON.parse(json.Status.author)
                        var htmlString =
                        `<div class="card">
                            <!--Information of post's user-->
                            <div class="d-flex justify-content-between p-2 px-2">
                                <div class="d-flex flex-row align-items-center">
                                    <img src="${author.image}" alt="" class="rounded-circle" width="52">
                                    <div class="d-flex flex-column ml-2">
                                        <span class="font-weight-bold">${author.fullName}</span>
                                        <small class="text-primary">Thông tin</small>
                                    </div>
                                </div>
                                <!--Time and more-->
                                <div class="time-and-more d-flex flex-row mt-2">
                                <small class="mr-2">${json.Status.currentTime}</small><i class="fas fa-ellipsis-v"></i>
                                </div>
                            </div>
                            <!--Area of post-->
                            <hr style="border: none;">
                            <p class="text-justify ml-3">${ json.Status.statusTitle }</p>
                            <img src="${ json.Status.image }" alt="" class="img-fluid">
                            <!-- Number of Comment and Interactive-->
                            <div class="d-flex justify-content-between align-items-centerl">
                                <div class="d-flex flex-row icons d-flex align-items-center ml-3 interactive_color">
                                    <span><i class="fa fa-thumbs-up"></i><a href=""> nam,loi,link,...</a> </span>
                                </div>
                                <div class="d-flex flex-row interactive_color m-3">
                                    <span class="mr-3 cmt">Bình luận</span>
                                    <span class="shares">Chia sẻ</span>
                                </div>
                            </div>
                            <hr>
                            <!--Interative-->
                            <div class="d-flex justify-content-between align-items-centerl mx-5">
                                <div class="like" onclick="getLikeStatus(this)" data-id="${json.Status._id}">
                                    <i class="fa fa-thumbs-up"></i> <span>Thích</span>
                                </div>
                                <div class="cmts">
                                    <i class="fa fa-comments"></i> <span>Bình  luận</span>
                                </div>
                                <div class="shr">
                                    <i class="fa fa-share-square"></i> <span>Chia sẻ</span>
                                </div>
                            </div>
                            <hr>
                            <!--Comment-->
                            <div class="comments mx-3">
                                <div class="d-flex flex-row mb-2"> <img src="/images/avatar-default.jpg" width="40" class="round-img">
                                    <div class="d-flex flex-column ml-2"> <span class="nameOfUser">User_Name</span> <small class="comment-text">What user was commented appear here</small>
                                        <div class="d-flex flex-row align-items-center interactive_comment_color">
                                            <small>Thích</small>
                                            <small>Trả lời</small>
                                            <small>Dịch</small>
                                            <small>20 phút</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-input"> <input type="text" class="form-control">
                                    <div class="fonts"><i class="fas fa-smile-beam"></i> <i class="fa fa-camera"></i>
                                    </div>
                                </div>
                            </div>
                        </div>`
                        // console.log(htmlString)
                        $(".multi-card").prepend(htmlString)
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