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

}

$.fn.extend({
    logMyEvent: function (eventName, text) {
        var log = $("<li>").html(new Date().toString() + " [" + eventName + "]: " + text);
        $("#logs").prepend(log);
    }
});

$(function () {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log(userAgent);
    var eventType = "keydown";
    if(userAgent.toLowerCase().indexOf("chrome") > -1) {
        eventType = "textInput";
    }

    $("#number-input")
        .on(eventType, function (e) {
            var position = getCaretPosition(e.target);
            var key = e.key === undefined ? String.fromCharCode(e.which) : e.key;
            if (e.originalEvent != undefined && e.originalEvent != null) {
                if (e.originalEvent.data != undefined && e.originalEvent.data != null) {
                    key = String.fromCharCode(e.originalEvent.data.charCodeAt(0));
                }
            }
            
            $("*").logMyEvent(e.type, JSON.stringify({ position: position, key: key }));
        });
        // .on("textInput", function (e) {
        //     var position = getCaretPosition(e.target);
        //     var key = null;
        //     if (e.originalEvent != undefined && e.originalEvent != null) {
        //         if (e.originalEvent.data != undefined && e.originalEvent.data != null) {
        //             key = String.fromCharCode(e.originalEvent.data.charCodeAt(0));
        //         }
        //     }
        //     $("*").logMyEvent("textInput", JSON.stringify({ position: position, key: key }));
        // });
})
