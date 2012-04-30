// Apprise 1.5 by Daniel Raftery
// http://thrivingkings.com/apprise
//
// Button text added by Adam Bezulski
//
// Cached jQuery variables, position center added by Josiah Ruddell

function apprise(string, user_args, callback) {

    var args = {
            confirm: false,       // Ok and Cancel buttons
            verify: false,        // Yes and No buttons
            input: false,         // Text input (can be true or string for default text)
            animate: false,       // Groovy animation (can true or number, default is 400)
            textOk: 'Ok',         // Ok button default text
            textCancel: 'Cancel', // Cancel button default text
            textYes: 'Yes',       // Yes button default text
            textNo: 'No',         // No button default text
            position: 'center'    // position center (y-axis) any other option will default to 100 top
        },
        doc = $(document),
        win = $(window),
        aHeight = doc.height(),
        aWidth = doc.width(),
        wrapper = $('<div class="appriseOuter" />'),
        overlay = $('<div class="appriseOverlay" />'),
        inner = $('<div class="appriseInner" />'),
        buttons = $('<div class="aButtons" />'),
        input,
        posTop = 100,
        prop;

    if (user_args) {
        for (prop in args){
            if (args.hasOwnProperty(prop) && typeof user_args[prop] !== "undefined"){
                args[prop] = user_args[prop];
            }
        }
    }

    overlay.css({ height: aHeight, width: aWidth })
        .appendTo('body')
        .fadeIn(100,function(){
            $(this).css('filter','alpha(opacity=70)');
        });

    wrapper.appendTo('body');

    inner.append(string).appendTo(wrapper);
        
    //Setting to strict equality check to ensure a default field value of 0 is permitted.
    if (args.input !== false) {
    
        var inputIsElement = (typeof (args.input) === 'object' || (args.input.nodeType && args.input.nodeType === 1));
        
        //if args.input is a jQuery object or DOM node, insert it directly.
        //otherwise default to a plain <input>
        input = (inputIsElement) ? args.input : $('<input class="aTextbox" />');
        
        //if args.input is a string, use it as the default value for <input>
        if (typeof (args.input) === 'string') { input.val(args.input); }

        inner.append($('<div class="aInput" />').append(input));
        input.focus();

    }

    inner.append(buttons);

    if (args.confirm || args.input) {
        buttons.append('<button value="ok">' + args.textOk + '</button>');
        buttons.append('<button value="cancel">' + args.textCancel + '</button>');
    } else if (args.verify) {
        buttons.append('<button value="ok">' + args.textYes + '</button>');
        buttons.append('<button value="cancel">' + args.textNo + '</button>');
    } else {
        buttons.append('<button value="ok">' + args.textOk + '</button>');
    }

    // position after adding buttons
    wrapper.css("left", (win.width() - wrapper.width()) / 2 + win.scrollLeft() + "px");

    // get center
    if (args.position === 'center') {
        posTop = (aHeight - wrapper.height()) / 2;
    }

    if (args.animate) {
        var aniSpeed = (isNaN(args.animate)) ? 400 : args.animate;
        wrapper.css('top', '-200px').show().animate({ top: posTop }, aniSpeed);
    } else {
        wrapper.css('top', posTop).fadeIn(200);
    }

    doc.keydown(function (e) {
        if (overlay.is(':visible')) {
            if (e.keyCode === 13){
                $('.aButtons > button[value="ok"]').click();
            }
            if (e.keyCode === 27){
                $('.aButtons > button[value="cancel"]').click();
            }
        }
    });


    $('.aButtons > button').click(function () {

        //Get the required values before deleting the apprise modal/fields
        var inputvalue = (input) ? input.val() : "",
            buttonvalue = $(this).attr("value");
        
        //Delete the apprise modal
        overlay.remove();
        wrapper.remove();

        //If a callback is specified, act on the values we just collected.
        if (callback) {
            if (buttonvalue === 'ok') {
                if (args.input) {
                    callback(inputvalue);
                } else {
                    callback(true);
                }
            } else if (buttonvalue === 'cancel') {
                callback(false);
            }
        }

    });

}
