$('#btn-like').click(function (e) {
    e.preventDefault();
    let image_id = $(this).data('id');

    $.post(`/images/${image_id}/like`)
        .done(data => {
            $('.likes-count').text(data.likes);
        })
        .fail(err => {
            console.log(err);
        });
});
