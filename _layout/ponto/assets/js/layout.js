// TABLE HEADER
// =============================================================================
function tableHeader(e) {
    var header = $('.table-header').children('li');
    var table  = $('.table-date').find('td');

    $(header).each(function(a) {
        var headerId = $(this);
        var largura  = 0;

        $(table).each(function(b) {
            if ( $(this).attr('data-labelby') != undefined ) {
                var labelfor = headerId.attr('data-labelfor');
                var labelby = $(this).attr('data-labelby');
                //console.log( $(this).attr('data-labelby') );

                if( labelby === labelfor && labelby != '1' ) {
                    //headerId.outerWidth( $(this).outerWidth() );
                    largura = $(this).outerWidth();
                };

                if( labelby === labelfor && labelby === '1' ) {
                    largura += $(this).outerWidth();
                };
            }
        });

        headerId.outerWidth( largura );
    });
};

$(function() {
    tableHeader();

    $(window).resize( function() {
        tableHeader()
    });
});

// MODAL
// =============================================================================
$(function() {
    $('[data-modal]').on('click', function(e) {
        var modal    = $(this).data('modal');
        var modalDiv = $('[data-modal-id="' + modal + '"]');

        modalDiv.fadeIn(300, function() {
            $(this).children('.modal-mask').on('click', function() {
                $(this).parent('.modal').fadeOut(300);
            });
        });

        e.preventDefault();
    });

    $('[data-close-modal-id]').on('click', function(e) {
        var modal    = $(this).data('close-modal-id');
        var modalDiv = $('[data-modal-id="' + modal + '"]');

        modalDiv.fadeOut(300);

        e.preventDefault();
    });
});

// LOADING
// =============================================================================
$(function() {
    $('[data-loading]').on('click', function(e) {
        $('.loading').fadeIn();

        setTimeout(function() {
            $('.loading').fadeOut();
        }, 3000);

        //console.log('click');

        e.preventDefault();
    });
});

// CHECKBOX REVEAL
// =============================================================================
$(function() {
    $('[data-reveal]').on('change', function() {
        var toReveal = $(this).data('reveal');

        if( $(this).is(':checked') ) {

            $(this).parents().find('[data-reveal-id="' + toReveal + '"]').fadeIn(300);

            //console.log( $(this).data('reveal') );
        } else {
            $(this).parents().find('[data-reveal-id="' + toReveal + '"]').fadeOut(300);
        }
    });
});

// URL CHECK
// =============================================================================
$(function() {
    var link          = $(location).attr('href');
    var firstCharLink = link.charAt(0);
    var splitedURL    = link.split("/");
    var urlIndex      = splitedURL.length-1;
    var indexedURL    = splitedURL[urlIndex];
    var firstCharLink = indexedURL.charAt(0);

    if( indexedURL.length > 0 && firstCharLink === '#' && indexedURL !== '#update' ) {
        var modalId  = indexedURL.replace("#","");
        var modalDiv = $('body').find('[data-modal-id="' + modalId + '"]');

        modalDiv.fadeIn(300, function() {
            $(this).children('.modal-mask').on('click', function() {
                $(this).parent('.modal').fadeOut(300);
            });
        });
    }

    $('a').on('click', function() {
        var url        = $(this).attr('href');
        var splitedURL = url.split("/");
        var urlIndex   = splitedURL.length-1;
        var indexedURL = splitedURL[urlIndex];
        var firstChar  = url.charAt(0);

        if( firstChar === '#' && url.length > 1 && indexedURL !== '#update' ) {
            $(location).attr('href', url);
        } else if( firstChar === '#' && url.length < 2 && indexedURL !== '#update' ) {
            $(location).attr('href', ' ');
        }
    });
});