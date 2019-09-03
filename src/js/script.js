function scroll() {
    var top = $(window).scrollTop();
    if (top < 100 && $(".header").length > 0) {
        $(".navbar-top").removeClass('scrolling');
    }
    if ($(".header").length == 0 || top > 100) {
        $(".navbar-top").addClass('scrolling');
    }
}

$(document).ready(function () {
    scroll();
    $(window).scroll(scroll);
    if ($(".header").length == 0) {
        $("#main-content").css({ 'margin-top': '100px' });
    }

    $(".scrollA").on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 500, 'linear');
    });

    if ($('#back-to-top').length) {
        var scrollTrigger = 100;
        var backToTop = function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                $('#back-to-top').addClass('show');
            } else {
                $('#back-to-top').removeClass('show');
            }
        };
        backToTop();
        $(window).on('scroll', function () {
            backToTop();
        });
        $('#back-to-top').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    }

    setTimeout(function () {
        $("#preload").fadeOut();
    }, 500);
});