$('#post-comment').hide();

$('#btn-toggle-comment').click(e => {
    e.preventDefault();
    $('#post-comment').slideToggle();
});

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

$('#btn-delete').click(function (e) {
    e.preventDefault();
    let $this = $(this);
    const response = confirm('Are you sure you want to delete this image?');

    if (response) {
        const image_id = $this.data('id');

        $.ajax({
            url: `/images/${image_id}`,
            type: 'DELETE'
        })
            .done(function (result) {
                $this.removeClass('btn-danger').addClass('btn-success');
                $this.find('i').removeClass('fa-times').addClass('fa-check');
                /*html*/
                $this.append(`
                    <span>Deleted!</span>
                `);

                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            })
            .fail(function (err) {
                console.log(err);
            });
    }
});
