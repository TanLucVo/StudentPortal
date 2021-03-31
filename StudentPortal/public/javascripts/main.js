// -------------------------------------------------------------------------------------------- //
// Index Page

// getLikeStatus
function getLikeStatus(element) {
    const idStatus = element.dataset.id
    const userImage = element.dataset.image
    const userId = element.dataset.userid
    const name = element.dataset.name
    let myLike = undefined
    $(document).ready(function () {
        fetch(`http://localhost:3000/status/${idStatus}`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            if (data.Status.like === undefined || data.Status.like === null) {
                $(`.${idStatus}`).addClass("liked");
                
                likes = []
                myLike = {
                    image : userImage,
                    _id : userId,
                    name : name
                }
                likes.push(myLike)
                $(`.view-${idStatus}`).text(likes.length)
                // console.log(like)
                data.Status.like = (JSON.stringify(likes))
            }
            else {
                likes = JSON.parse(data.Status.like)
                // console.log(idStatus)
                // kiểm tra user đã like bài viết hay chưa
                let new_likes = []
                let check_user_like = false
                // console.log("old likes:",likes.length)
                likes.forEach((like,index) => {
                    if (like._id === userId) {
                        check_user_like = true
                    }
                    else {
                        new_likes.push(like)
                    }
                });
                // console.log("new likes:",new_likes.length)
                if (check_user_like) {
                    $(`.${idStatus}`).removeClass("liked");
                    $(`.view-${idStatus}`).text(new_likes.length)
                    // gỡ lượt thích bài viết của user
                    data.Status.like = (JSON.stringify(new_likes))
                }
                else {
                    $(`.${idStatus}`).addClass("liked");
                    // tạo lượt thích bài viết cho user
                    myLike = {
                        image : userImage,
                        _id : userId,
                        name : name
                    }
                    likes.push(myLike)
                    $(`.view-${idStatus}`).text(likes.length)
                    // console.log("likes new:",likes.length)
                    data.Status.like = (JSON.stringify(likes))
                }
            }
            fetch(`http://localhost:3000/status/${idStatus}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data.Status)
            })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    // console.log(json)
                }
            }).catch(e => console.log(e))
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
    socket.on('add-notification', (data) => {
        
        $(".notificationPage .list-notification").prepend(
            ` <li class="list-group-item">
                <h4 class="title" >${data.title}</h4>
                <div class="content">
                    <a href="/notification/${data.department}/${data.id}">Chi tiết thông báo</a>
                </div>
                <p class="font-italic">[${data.departmentName }] - ${new Date(data.createAt).toJSON().slice(0,10).split('-').reverse().join('-')}</p>
            </li>`)

        $("#getNotification").fadeIn()
        
        $("#getNotification strong").text(data.departmentName +" Đã đăng một thông báo")
        $("#getNotification small").text(Math.floor((Date.now() - data.createAt) / 1000) +" giây trước")
        $("#getNotification .toast-body").text(data.title)
        $(".toast").toast('show')
        $(".vertical-timeline").prepend(`
        <div class="vertical-timeline-item vertical-timeline-element">
            <div>
                <span class="vertical-timeline-element-icon bounce-in">
                    <i class="far fa-dot-circle"></i>
                </span>
                <div class="vertical-timeline-element-content bounce-in">
                    <h4 class="timeline-title">${data.departmentName}</h4>
                    <p>${data.title}</p>
                    <a href="/notification/${data.department}/${data.id}">Xem chi tiết</a>
                    <span class="vertical-timeline-element-date" data-time=${data.createAt}>${getPassedTime(data.createAt,Date.now())}</span>
                </div>
            </div>
        </div>
    `)
        $("#getNotification").delay(5000).fadeOut()

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
        $('.index-page .side-panel').removeClass('active');
    });

    // top menu list
    $('.main-menu > span').on('click', function () {
        // slideToggle(): Hiển thị và ẩn các thành phần phù hợp với hiệu ứng chuyển động trượt (slide).
        $('.nav-list').slideToggle(300);
    });

    $('.index-page .setting-all').on('click', function() {
        $('.index-page .side-panel').toggleClass('active');
    });

    $('.index-page .post-btn-preview').on('click', function() {
        $('.index-page .preview-image-upload').toggleClass('active');
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

    // -------------------------------------------------------------------------------------------
    // fetch api - status
    // tinyMCE
    tinymce.init({
        height: "350",
        selector: '.index-page #imageUpload',
        plugins: 'autoresize lists code emoticons media mediaembed pageembed paste powerpaste',
        toolbar: 'undo redo | styleselect | bold italic | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'outdent indent | numlist bullist | emoticons',
        emoticons_append: {
            custom_mind_explode: {
                keywords: ['brain', 'mind', 'explode', 'blown'],
                char: '🤯'
            }
        },
        autoresize_max_height: 500,
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
    });

    $(".index-page .post-btn").click(e => {
        var file_data = $('.index-page #imageUpload').prop('files')[0];
        var statusTitle = $('.index-page textarea.statusTitle').val()
        // console.log(statusTitle)
        // console.log(file_data)
        var form_data = new FormData();
        userId = e.target.dataset.id
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
                        if (json.Status.like) {
                            like = JSON.parse(json.Status.like)
                        }
                        else{
                            like = 0
                        }
                        var htmlString =
                        `<div class="card">
                            <!--Information of post's user-->
                            <div class="d-flex justify-content-between p-2 px-2">
                                <div class="d-flex flex-row align-items-center">
                                    <img src="${author.image}" alt="" class="image-user rounded-circle" width="52">
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
                                    <span><i class="fa fa-thumbs-up"></i> <a class="view-${json.Status._id}" href=""> ${like}</a> </span>
                                </div>
                                <div class="d-flex flex-row interactive_color m-3">
                                    <span class="mr-3 cmt">Bình luận</span>
                                    <span class="shares">Chia sẻ</span>
                                </div>
                            </div>
                            <hr>
                            <!--Interative-->
                            <div class="d-flex justify-content-between align-items-centerl mx-5">
                                <div class="like ${json.Status._id}" onclick="getLikeStatus(this)" data-userid="${author.userId}" data-name="${author.fullName}" data-image="${author.image}" data-id="${json.Status._id}">
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
    // preview image uploaded

    $('.index-page #imageUpload').change(e => {
        console.log("bắt event chọn ảnh")
    })

    // -------------------------------------------------------------------------------------------

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

 
});
$(".notificationPage").ready(()=>{
    console.log("notificationPage ready")
})
const getPassedTime = (startTime, endTime) => {
    let passTime = Math.floor((endTime - startTime) / 1000)
    let outputTime = ""
    if (passTime < 60)
        outputTime = passTime + " giây trước"
    else if (passTime < (60 * 60))
        outputTime = Math.floor(passTime / 60) + " phút trước"
    else if (passTime < (60 * 60 * 60))
        outputTime = Math.floor(passTime / (60 * 60)) + " giờ trước"
    else if (passTime < (60 * 60 * 60 * 24))
        outputTime = Math.floor(passTime / (60 * 60 * 24)) + " ngày trước"
    else if (passTime < (60 * 60 * 60 * 24 * 30))
        outputTime = Math.floor(passTime / (60 * 60 * 24 * 30)) + " tháng trước"
    return outputTime
}

if($(".index-page")[0]){

    var myVar = setInterval(myTimer, 60000);

    function myTimer() {
        let a= $('.vertical-timeline-element-content .vertical-timeline-element-date');
        
        $.each(a,(i,item)=>{
            item.innerHTML = getPassedTime(parseInt(item.dataset.time),Date.now())
        })
    }
    
    let page =1
    $(".loading").show()
    fetch('/api/notification', {
        method: 'GET', // or 'PUT'
    })
    .then(response => response.json())
    .then(data => {
        $(".loading").hide()
        
        for(let i of data.data){
            $(".vertical-timeline").append(`
                <div class="vertical-timeline-item vertical-timeline-element">
                    <div>
                        <span class="vertical-timeline-element-icon bounce-in">
                            <i class="far fa-dot-circle"></i>
                        </span>
                        <div class="vertical-timeline-element-content bounce-in">
                            <h4 class="timeline-title">${i.author}</h4>
                            <p>${i.title}</p>
                            <a href="/notification/${i.department}/${i._id}">Xem chi tiết</a>
                            <span class="vertical-timeline-element-date" data-time=${i.createAt}>${getPassedTime(i.createAt,Date.now())}</span>
                        </div>
                    </div>
                </div>
            `)
        }
        $('.vertical-timeline').append($('.spinerLoadingNotification'))
        $('.spinerLoadingNotification').hide()
        

    })
    .catch((error) => {
        $(".loading").hide()
        $('.spinerLoadingNotification').hide()
        console.log('Error:', error);
    });
    $(".card-body").scroll(function() {
        
        if($('.card-body')[0].scrollHeight - $('.main-card').height() === $(".card-body").scrollTop()) {
            console.log(`Loading....`);
            $(".spinerLoadingNotification .spinner-border").show();
            $(".spinerLoadingNotification p").hide()
            $('.vertical-timeline').append($('.spinerLoadingNotification'))
            $('.spinerLoadingNotification').show()
            page +=1
            fetch('/api/notification?page='+page, {
                method: 'GET', // or 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                if(data.data.length ===0){
                    $(".spinerLoadingNotification .spinner-border").hide();
                    $(".spinerLoadingNotification p").show()
                    return 
                }
                $(".spinerLoadingNotification").hide()
                let stringdata =''
                for(let i of data.data){
                    stringdata +=`
                        <div class="vertical-timeline-item vertical-timeline-element">
                            <div>
                                <span class="vertical-timeline-element-icon bounce-in">
                                    <i class="far fa-dot-circle"></i>
                                </span>
                                <div class="vertical-timeline-element-content bounce-in">
                                    <h4 class="timeline-title">${i.author}</h4>
                                    <p>${i.title}</p>
                                    <a href="/notification/${i.department}/${i._id}">Xem chi tiết</a>
                                    <span class="vertical-timeline-element-date" data-time=${i.createAt}>${getPassedTime(i.createAt,Date.now())}</span>
                                </div>
                            </div>
                        </div>
                    `
                }
                $(".vertical-timeline").append(stringdata)
                $('.vertical-timeline').append($('.spinerLoadingNotification'))
                $(".spinerLoadingNotification").hide()
        
            })
            .catch((error) => {
                $('.vertical-timeline').append($('.spinerLoadingNotification'))
                $(".spinerLoadingNotification").hide()
                console.log('Error:', error);
            });
        }
    });

}


   // addDepartment
if($(".addDepartment")[0]){
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
        .use(Uppy.Dashboard, {
            trigger: '#register',
            inline: true,
            target: '#drag-drop-area',
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
}


// -------------------------------------------------------------------------------------------- //