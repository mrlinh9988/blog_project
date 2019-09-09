// Bắt sự kiện khi ấn nút xác nhận edit post
function Post() {
    function bindEvent() {
        // Bắt sự kiện ấn vào nút edit
        $('.post_edit').click(function (e) {

            var params = {
                id: $('.id').val(),
                title: $('.title').val(),
                content: tinymce.get('content').getContent(),
                author: $('.author').val()
            }

            var base_url = location.protocol + '//' + document.domain + ':' + location.port;
            console.log(base_url);

            // Khi ấn nút Edit thì dùng ajax gửi lên server 1 request PUT tới đường dẫn base_url
            $.ajax({
                url: base_url + '/admin/post/edit',
                type: "PUT",
                data: params,
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        location.reload()
                    }
                }
            });
        });

        // Khi click vào nút Delete 
        $('.post_delete').click(function (){
            window.alert('Có chắc chắn xóa không?');
            // Lấy ra id cần xóa
            var postId = $(this).attr('post_id');

            var base_url = location.protocol + '//' + document.domain + ':' + location.port;
            $.ajax({
                url: base_url + '/admin/post/delete',
                type: "DELETE",
                data: { id: postId },
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                        location.reload()
                    }
                }
            });
        });
    }

    bindEvent();
}

$(document).ready(function () {
    new Post();
}); 