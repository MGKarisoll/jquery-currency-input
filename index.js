function getCaretPosition(ctrl) {
    // IE < 9 Support 
    if (document.selection) {
        ctrl.focus();
        var range = document.selection.createRange();
        var rangelen = range.text.length;
        range.moveStart('character', -ctrl.value.length); var start = range.text.length - rangelen;
        return { 'start': start, 'end': start + rangelen };
    } // IE >=9 and other browsers
    else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        return { 'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
    } else {
        return { 'start': 0, 'end': 0 };
    }
}

function checkForCurrencyInput(stringValue) {
    var pattern = /^\d{1,23}\.?\d{0,2}$/g;
    return pattern.test(stringValue);
}

$.fn.extend({
    logMyEvent: function (eventName, value) {
        var log = $("<li>").html(new Date().toString() + " [" + eventName + "]: " + JSON.stringify(value));
        $("#logs").prepend(log);
    }
});

$(function () {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var eventType = "keydown";
    if (userAgent.toLowerCase().indexOf("chrome") > -1) {
        eventType = "textInput";
    }

    $("#number-input")
        .on("touchstart", function (e) {
            // iOS detection from: http://stackoverflow.com/a/9039885/177710
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                $(event.target).attr("type", "number");
                $(event.target).removeAttr("pattern");
            }

            if (userAgent.toLowerCase().indexOf("firefox") > -1) {
                $(event.target).attr("type", "number");
                $(event.target).attr("step", "any");
            }
        })
        .on(eventType, function (e) {
            var key = e.key === undefined ? String.fromCharCode(e.which) : e.key;
            if (e.originalEvent != undefined && e.originalEvent != null) {
                if (e.originalEvent.data != undefined && e.originalEvent.data != null) {
                    key = String.fromCharCode(e.originalEvent.data.charCodeAt(0));
                }
            }

            if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "Control", "Alt"].indexOf(key) > -1) {
                return true;
            }

            var position = getCaretPosition(e.target);
            $("*").logMyEvent(e.type, { position: position, key: key });

            var $input = $(e.target);
            var oldValue = $input.val();
            var newValue = oldValue.substr(0, position.start) + key + oldValue.substr(position.end);
            var checkForCurrencyInputResult = checkForCurrencyInput(newValue);

            $("*").logMyEvent(e.type, { oldValue, newValue, checkForCurrencyInputResult });

            if (checkForCurrencyInputResult === false) {
                e.preventDefault();
                return false;
            }
        });
})
