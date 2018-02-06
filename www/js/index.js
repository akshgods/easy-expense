var notification, db;

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        makeDB();
        try {
            window.addEventListener('keyboardDidHide', keyboardClose);
            window.addEventListener('keyboardDidShow', keyboardOpen);
            notification = cordova.plugins.notification.local;
            if (cordova.platformId == 'android') {
                StatusBar.backgroundColorByHexString("#A01536");
            }

        } catch (err) {
            console.log(err);
        }

    }
};
app.initialize();

var database = {
    insert: function (expense_name, price, date) {
        var d = mydate();
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO expense (expense_name,price,date) VALUES (?,?,?)', [expense_name, price, d]);
        }, function (error) {
            console.log('Transaction ERROR: ' + error.message);
        }, function () {
            console.log('Populated database OK');
        });
    },
    selectAll: function () {
        console.log('select all: ', db);

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM expense', [], function (tx, results) {
                // return results.rows;               
                var len = results.rows.length,
                    i;
                for (i = 0; i < len; i++) {
                    console.log(results.rows.item(i).log);
                }
            }, null);
        });
    }
}

function makeDB() {
    try {
        db = window.sqlitePlugin.openDatabase({
            name: "expense.db",
            androidDatabaseImplementation: 2
        });
    } catch (error) {
        db = window.openDatabase("expense.db", '1.0', 'Expense Database', 2 * 1024 * 1024);
    }
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS expense (id INTEGER PRIMARY KEY,expense_name, price , date DATE )');
    }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function () {
        console.log('Populated database OK');
        showOldData();
    });
}

function showOldData() {
    var result = database.selectAll();
    console.log('result', result);
}



function keyboardOpen() {
    $(".index").addClass('morepadding');
    navigator.vibrate(20);
}

function keyboardClose() {
    navigator.vibrate(20);
    $(".index").removeClass('morepadding');
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
        document.querySelector('#loader').style.display = 'none';
        document.querySelector('#index').style.display = 'block';
        // setTimeout(eatCount, 3000);
        clearInterval(timer);
    }
}, 30);


// Best to view this pen in full screen as it doesn't play ball in editor view

// Var
output = $(".total h2");
et = 0;

function mydate() {
    var d = new Date();
    return (d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate());
}
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
        et = parseInt(et) + parseInt(ep);
        $("table").append("<tr>" + "<td id='name'>" + en + "</td>" + "<td id='list'>" + ep + "</td>" + "<td id='delete' value='" + ep + "'>" + "<i class='material-icons'>highlight_off</i>" + "</td>" + "</tr>")
        $("#expenseName, #expensePrice").val('');
        var text = 'Name: ' + en + ' Price: ' + ep;
        showNotification('Added Successfully', text);
        database.insert(en, ep);
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
    // $("#expenseName").focus();
})

// Keyboard event
$("input").keydown(function (event) {
    if (event.which === 13) {
        add();
        calculate();
        // Focus on expense name field
        // $("#expenseName").focus();
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

function showNotification(title, msg) {
    notification.schedule({
        title: title,
        text: msg,
        icon: 'http://climberindonesia.com/assets/icon/ionicons-2.0.1/png/512/android-chat.png',
        foreground: true
    });
}