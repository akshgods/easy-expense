
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        try {
            window.addEventListener('keyboardDidHide', keyboardClose);
            window.addEventListener('keyboardDidShow', keyboardOpen);
            cordova.plugins.Keyboard.disableScroll(false);
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            if (cordova.platformId == 'android') {
                StatusBar.backgroundColorByHexString("#A01536");
            }
            console.log(navigator.vibrate);
        } catch (err) {
            console.log(err);
        }

    }
};

app.initialize();

function keyboardOpen(e) {
    $(".index").addClass('morepadding');
    navigator.vibrate(20);
// alert('show');
}
function keyboardClose() {
    // alert("keybord close");
    navigator.vibrate(20);
    $(".index").removeClass('morepadding');
    document.activeElement.blur();
}


var percent = 0

// function eatCount() {
//     document.querySelector(".monsterText").innerHTML = ("We are<br>SQUARE<br>MONSTER!");
//     // $(".monsterText").html("We are<br>SQUARE<br>MONSTER!")
// }

var timer = setInterval(function () {
    // $(".bar").css("width",percent+"%")
    document.querySelector(".bar").style.setProperty("width", percent + "%")
    percent += 1
    if (percent > 100) {
        // $(".pageLoading").addClass("complete")
        document.querySelector(".pageLoading").classList.add("complete");
        document.querySelector('#loader').style.display= 'none';
        document.querySelector('#index').style.display='block';
        // setTimeout(eatCount, 3000);
        clearInterval(timer);
    }
}, 30);


// Best to view this pen in full screen as it doesn't play ball in editor view

// Var
output = $(".total h2");
et = 0;

// Add expense
function add() {
    var en = $("input#expenseName").val();
    var ep = $("input#expensePrice").val();
    if ($("#totalMonth").val() <= 0) {
        alert("You must enter a total months balance");
    } else if ($("#expenseName").val() <= 0) {
        alert("You must give an expense a name");
    } else if ($("#expensePrice").val() <= 0) {
        alert("You must give an expense a price");
    } else {
        Keyboard.hide();
        et = parseInt(et) + parseInt(ep);
        $("table").append("<tr>" + "<td id='name'>" + en + "</td>" + "<td id='list'>" + ep + "</td>" + "<td id='delete' value='" + ep + "'>" + "<i class='material-icons'>highlight_off</i>" + "</td>" + "</tr>")
        $("#expenseName, #expensePrice").val('');
    }
}

// Calculate
function calculate() {
    var total = $("#totalMonth").val();
    output.html(total - et);
    console.log(total)
    console.log(et)
}

// Calculate final total live
$('#totalMonth').keyup(function () {
    output.html($(this).val())
})

// Event
$('#add').on('click', function () {
    add();
    calculate();

    // Focus on expense name field
    $("#expenseName").focus();
})

// Keyboard event
$("input").keydown(function (event) {
    if (event.which === 13) {
        add();
        calculate();

        // Focus on expense name field
        $("#expenseName").focus();
    }
})

// Delete function
$(document).on('click', '#delete', function () {
    $(this).animate({
        opacity: 0
    }, 500, function () {
        $(this).parent().remove();
        var r = $(this).attr('value')
        et = et - r;
        calculate();
    })
})
