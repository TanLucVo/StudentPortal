// -------------------------------------------------------------------------------------------- //
// Index Page

// window.parent.location.origin = http://localhost:3000

// -------------------------------------------------------------------------------------------
    // comment

function fetchApiComment(element) {
    const statusId = element.dataset.status
    const author = element.dataset.author
    const content = document.getElementById(`text-content-comment${statusId}`).value;
    var data = {
        statusId: statusId,
        author: author,
        content: content
    }
    $(document).ready(function () {
        fetch(window.parent.location.origin + '/comment',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
        }).catch(e => console.log(e))
    })
}
// -------------------------------------------------------------------------------------------
// getLikeStatus

function getLikeStatus(element) {
    const idStatus = element.dataset.id
    const userImage = element.dataset.image
    const userId = element.dataset.userid
    const name = element.dataset.name
    let myLike = undefined
    $(document).ready(function () {
        fetch(window.parent.location.origin + `/status/${idStatus}`,{
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
            fetch(window.parent.location.origin + `/status/${idStatus}`,{
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
// -------------------------------------------------------------------------------------------
$(document).ready(async function () {
    const socket = io()
    socket.on('connect', handleConnectionSuccess);
    socket.on('disconnect', () => {
        console.log("Mat ket noi voi server");
    });
    socket.on('list-users', handleUserList);
    // -------------------------------------------------------------------------------------------
    // socket add notification

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
    // -------------------------------------------------------------------------------------------
    // socket add comment

    socket.on('add-comment', (data) => {
        // console.log("data comment:",data)
        fetch(window.parent.location.origin + `/user/${data.author}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
            console.log('data user:',json)
            if (json.success) {
                $(`.index-page .comments${data.statusId}`).prepend(
                    `<div class="d-flex flex-row mb-2">
                        <img src="${json.user.image}" width="40" class="round-img">
                        <div class="d-flex flex-column ml-2"> <span
                                class="nameOfUser">${json.user.name}</span>
                                <small class="comment-text">${data.content}</small>
                            <div
                                class="d-flex flex-row align-items-center interactive_comment_color">
                                <small>Thích</small>
                                <small>Trả lời</small>
                                <small>Dịch</small>
                                <small>${getPassedTime(new Date(data.dateModified),Date.now())}</small>
                            </div>
                        </div>
                    </div>`
                )

                // set input content comment = ""
                $(`.index-page .comment-input #text-content-comment${data.statusId}`).val("");
            }
        }).catch(e => console.log(e))

    })

    function handleUserList(user){
        console.log(user)
    }
    function handleConnectionSuccess(){
        console.log("da ket noi thanh cong voi id"+socket.id);
        let userId = '<%= user.id %>'
        socket.emit('register-id', {socketId:socket.id,userId:userId }) //gui id qua cho server
    }
    // -------------------------------------------------------------------------------------------
    /*--- left menu full ---*/
    $(' .menu-small').on("click", function () {
        $(".fixed-sidebar.left").addClass("open");
    });
    $('.closd-f-menu').on("click", function () {
        $(".fixed-sidebar.left").removeClass("open");
    });
    // -------------------------------------------------------------------------------------------
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
    // -------------------------------------------------------------------------------------------
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
    // tinyMCE
    // tinymce.init({
    //     height: "350",
    //     selector: '.index-page textarea.statusTitle',
    //     plugins: 'autoresize lists code emoticons media mediaembed pageembed paste powerpaste',
    //     toolbar: 'undo redo | styleselect | bold italic | ' +
    //         'alignleft aligncenter alignright alignjustify | ' +
    //         'outdent indent | numlist bullist | emoticons',
    //     emoticons_append: {
    //         custom_mind_explode: {
    //             keywords: ['brain', 'mind', 'explode', 'blown'],
    //             char: '🤯'
    //         }
    //     },
    //     autoresize_max_height: 500,
    //     tinycomments_mode: 'embedded',
    //     tinycomments_author: 'Author name',
    //     inline_boundaries: false,
    // });
    // -------------------------------------------------------------------------------------------
    // fetch api - status
    $( ".index-page textarea.statusTitle" ).keyup(function() {
        if ($('.index-page textarea.statusTitle').val().length !== 0) {
            $('.index-page .post-btn').prop('disabled', false)
            $('.index-page .post-btn').css('cursor', 'pointer')
        }
        else {
            $('.index-page .post-btn').prop('disabled', true)
            $('.index-page .post-btn').css('cursor', 'no-drop')
        }
    });
    if ($('.index-page textarea.statusTitle').val().length === 0) {
        $('.index-page .post-btn').prop('disabled', true)
        $('.index-page .post-btn').css('cursor', 'no-drop')
    }
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
        if (statusTitle.length !== 0) {
            form_data.append('imageStatus', file_data);
            form_data.append('statusTitle', statusTitle);
            form_data.append('author', JSON.stringify(user))
            uploadImage(form_data, user)
        }
        function uploadImage(form_data, user) {
           fetch(window.parent.location.origin, { // Your POST endpoint
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
                            <div class="comments mx-3 comments${json.Status._id}">
                                <div class="d-flex flex-row mb-2">
                                    <img src="/images/avatar-default.jpg" width="40" class="round-img">
                                    <div class="d-flex flex-column ml-2"> <span class="nameOfUser">User_Name</span> <small class="comment-text">What user was commented appear here</small>
                                        <div class="d-flex flex-row align-items-center interactive_comment_color">
                                            <small>Thích</small>
                                            <small>Trả lời</small>
                                            <small>Dịch</small>
                                            <small>20 phút</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-input">
                                    <input type="text" class="form-control" id="text-content-comment${json.Status._id}">
                                    <div class="fonts send-comment" data-author="${user.userId}" data-status = "${json.Status._id}" onclick="fetchApiComment(this)">
                                        <i class="fas fa-paper-plane"></i>
                                    </div>
                                </div>
                            </div>
                        </div>`
                        // console.log(htmlString)
                        $(".multi-card").prepend(htmlString)
                        

                        // set null in content and image upload = null
                        if (file_data !== undefined) {
                            $('.index-page .image-upload-preview .close-icon').trigger('click');
                        }
                        $('.index-page textarea.statusTitle').val("");

                        $('.index-page .post-btn').prop('disabled', true)
                        $('.index-page .post-btn').css('cursor', 'no-drop')
                    }
                })
                .catch(e => console.log(e))
        }
    });
    // -------------------------------------------------------------------------------------------
    // preview image uploaded
    $(document).delegate('.index-page .image-upload-preview .close-icon', 'click', function () {
        $('.index-page .image-upload-preview').slideToggle(300, 'swing');
        $(".index-page #imageUpload").val(null)
        setTimeout(() => {
            $("#output").attr("src", null)
        }, 300);
    })
    $('.index-page #imageUpload').change(e => {
        var file = e.target.files[0]
        // console.log(file)
        
        var reader = new FileReader();
        reader.onload = function () {
            var output = document.getElementById('output');
            output.src = reader.result;
        };
        reader.readAsDataURL(file);
        $(".image-upload-preview").css("display", "block")
        $('.index-page .preview-image-upload').addClass('active');
    })
    // -------------------------------------------------------------------------------------------
    // Scroll load status
    $(window).on("scroll", function() {
        var scrollHeight = $(document).height();
        var scrollPosition = $(window).height() + $(window).scrollTop();
        if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
            console.log("dang scroll............... STATUS")
        }
    });
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
    if($(".notificationPage")[0]){
        var data = []
        let indexPage=1
        let numberPage = 1
        function displayNotification(data){
            if(data.length ===0){
                $(".list-notification").children().remove()
                return
            } 
            let tempData = [...data]

            if(!isNaN(tempData[0].createAt)){
                tempData.forEach(e =>{
                    let d = new Date(e.createAt);
                    e.createAt = d.toJSON().slice(0,10).split('-').reverse().join('-')
                })
            }
            
            let stringdata = ''
            tempData.forEach(item =>{

                stringdata +=`
                    <li class="list-group-item">
                        <h4 class="title" >${item.title}</h4>
                        <div class="content">
                            <a href="/notification/${item.department}/${item._id}">Chi tiết thông báo</a>
                        </div>
                        <p class="font-italic">[${item.author }] - ${item.createAt}</p>
                    </li>
                `
            })
            let size =$(".background-masker").parent().parent().length
            let count = 1
            $(".background-masker").parent().parent().fadeTo("slow" , 0.7,function() {
                $(this).remove();
                
                if(count ===size ){
                    $(".list-notification").children().remove()
                    $(".list-notification").append(stringdata)
                    count = 1 
                }
                count +=1
            })

        }
        function splitArrayIntoChunksOfLen(arr1, len) {
            let arr = [...arr1]
            var chunks = [], i = 0, n = arr.length;
            while (i < n) {
                chunks.push(arr.slice(i, i += len));
            }
            return chunks;
        }
        function displayPagination(count){
            let pagination = Math.ceil(count/10)
            numberPage = pagination
            let stringPagination=`<li class="page-item previous disabled">
                                    <button class="page-link" tabindex="-1">Previous</button>
                                </li>`
            for(let i = 1;i<= pagination;i++){
                
                if(i == 1){
                    stringPagination += `<li class="page-item active"><button class="page-link numpage" value=${i} >${i}</button></li>`
                }else{
                    stringPagination += `<li class="page-item"><button class="page-link numpage" value=${i} >${i}</button></li>`
                }
            }
            stringPagination+=`<li class="page-item next">
                                    <button class="page-link" >Next</button>
                                </li>`
            $(".notificationPage .pagination").children().remove()
            if(pagination ===0) return 
            $(".notificationPage .pagination").append(stringPagination)
            if(1===pagination){
                $(".page-item.next").addClass("disabled")
            }
            $(".numpage").click( async e =>{
                $(".notificationPage .page-item button").addClass("disabledbutton")
                $(".page-item.next").addClass("disabled")
                $(".page-item.previous").addClass("disabled")
                indexPage = parseInt(e.target.value)
           

                $.when( $(".list-notification").children().remove()).done(async function() {
                    $(".list-notification").append(` <li class="list-group-item ">
                            <div class="animated-background">
                                <a class="background-masker font-weight-bold " href="#"></a>
                                <p class="background-masker head"></p>
                                <div class="background-masker content">
                                </div>
                                <p class="background-masker body"></p>
                            </div>
                    </li>`.repeat(7))
                    //page cu~
                    $('.page-item.active').children().prop('disabled', false);
                    $(".page-item.active").removeClass("active")
    
                    //page moi
                    e.target.parentNode.classList.add("active")
                    $('.page-item.active').children().prop('disabled', true);

                        
                    let [data, count] =await fetchDataNotification(indexPage)
                    displayNotification(data)

                    $(".notificationPage .page-item button").removeClass("disabledbutton")
                    $(".notificationPage .page-item").removeClass("disabled")
                    
                    if(indexPage === numberPage){
                        $('.page-item.next').addClass("disabled")
                    }else{
                        $('.page-item.next').removeClass("disabled")
                    }

                    if(indexPage === 1){
                        $('.page-item.previous').addClass("disabled")
                    }else{
                        $('.page-item.previous').removeClass("disabled")
                    }
                });
                

            })
            $('.page-item.previous').click(()=>{
                if($(".page-item.previous").hasClass("disabled")) return 
                
                if(indexPage === 1)return 
                indexPage -= 1
                $(`.page-item button[value=${indexPage}]`).click()                
            })
            $('.page-item.next').click(()=>{
                if($(".page-item.next").hasClass("disabled")) return 
                if(indexPage === numberPage)return 
                indexPage += 1
                $(`.page-item button[value=${indexPage}]`).click()                
            })
        }
        async function fectchDataWithParam(numpage, maphong, unread, start, end){
            let url_getNotification = new URL(window.parent.location.origin+'/api/notification')
            let params = {page:numpage,maphong:maphong, unread: unread, start:start, end:end}
            url_getNotification.search = new URLSearchParams(params).toString();
            const getFilterNotification = await fetch(url_getNotification, {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let data_notification = await getFilterNotification.json();
            data = data_notification.data
            return [data, data_notification.count]
        }
        async function fetchDataNotification(numpage){
            const phongban =  $('#selectDepartment option:selected').val()
            const unread = $("#unread").is(":checked")

            const beginDatepicker = moment(`${$("#beginDatepicker").val()} 00:00:00`, "DD-MM>-YYYY hh:mm:ss").valueOf()  || 0
            const endDatepicker = moment.utc(`${$("#endDatepicker").val()} 23:59:59`, "DD-MM-YYYY hh:mm:ss").valueOf()  || Date.now()
            //moment
            let result = await fectchDataWithParam(numpage, phongban, unread, beginDatepicker, endDatepicker)
            
            return result
        }

        try {
            
            let maphong = $('#selectDepartment option:selected').val()

            const result = await fetch(window.parent.location.origin+"/api/notification?maphong="+maphong, {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            data = await result.json();
            displayPagination(data.count)
            data = data.data
            displayNotification(data)
            
        } catch (error) {
            console.log(error)
            $(".background-masker").parent().parent().fadeOut( function() { $(this).remove(); })
        }
       
        let startTimePicker = $('#beginDatepicker').datepicker({
            uiLibrary: 'bootstrap4',
            format: 'dd-mm-yyyy' 
        });
        let endTimePicker =$('#endDatepicker').datepicker({
            uiLibrary: 'bootstrap4',
            format: 'dd-mm-yyyy' 
        });

        $(".notificationPage #form_filter").submit(async e=>{
            e.preventDefault()
            $(".list-notification")
            $(".list-notification").children().remove()
            $(".list-notification").append(` <li class="list-group-item ">
                    <div class="animated-background">
                        <a class="background-masker font-weight-bold " href="#"></a>
                        <p class="background-masker head"></p>
                        <div class="background-masker content">
                        </div>
                        <p class="background-masker body"></p>
                    </div>
            </li>`.repeat(7))
            indexPage = 1
            let [data, count] =await fetchDataNotification(1)
            displayNotification(data)
            displayPagination(count)
        })

        
        if($(".notificationPage #editor")[0]){
            $(document).on('focusin', function (e) {
                if ($(e.target).closest(".tox-dialog").length) {
                    e.stopImmediatePropagation();
                }
            });
            tinymce.init({
                selector: '#editor',
                height: 400,
                plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                toolbar_mode: 'floating',
                plugins: [
                    'advlist autolink link image lists charmap print preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
                    'table emoticons template paste help'
                ],
                toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | link image | print preview media fullpage | ' +
                'forecolor backcolor emoticons | help',
                menu: {
                    favs: {title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons'}
                },
                menubar: 'favs file edit view insert format tools table help',
            });
            
            $(".post_notification_button").click(e=>{
                e.preventDefault()
                let title = $("#titleNotification").val()
                let content = tinyMCE.activeEditor.getContent({format : 'raw'})
                let department =$("#formAddNotification").data('url');
                console.log(title, content, department)
                try {
                    $.post( "/api/notification",{title:title, content:content, department:department}, function( data, status ) {
                        console.log(data)
                    if(data.data){
                        $("#formAddNotification input").val("")
                        tinyMCE.activeEditor.setContent('');
                        $(".messageAddNotification").addClass('text-success').removeClass('text-danger').text("Thêm thông báo thành công ")
                    }else{

                        let errmessage = data.message.msg || data.message
                        $(".messageAddNotification").addClass('text-danger').removeClass('text-success').text("Thêm thông báo thất bại: "+ errmessage)
                    }
                });
                } catch (error) {
                    console.log(error)
                    $(".messageAddNotification").addClass('text-danger').removeClass('text-success').text("Thêm thông báo thất bại")
                }
                
            })
        }
    }
});

const getPassedTime = (startTime, endTime) => {
    let passTime = Math.floor((endTime - startTime) / 1000)
    let outputTime = ""
    if (passTime < 60)
        outputTime = passTime + " giây trước"
    else if (passTime < (60 * 60))
        outputTime = Math.floor(passTime / 60) + " phút trước"
    else if (passTime < (60 * 60 * 24))
        outputTime = Math.floor(passTime / (60 * 60)) + " giờ trước"
    else if (passTime < (60 * 60 * 24 * 30))
        outputTime = Math.floor(passTime / (60 * 60 * 24)) + " ngày trước"
    else if (passTime < (60 * 60 * 24 * 30 *365))
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