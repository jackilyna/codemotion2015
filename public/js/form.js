$(function() {
    var hash = false;
    if (window.location.hash.length > 0) {
        hash = window.location.hash.substr(1);
    }

    var pong = new Pong();
    var socket = pong.getSocket();

    $("#buttonsContainer").removeClass("hide");

    $("#hostGame").click(function () {
        $("#buttonsContainer").addClass("hide");
        $("#qrcodeContainer").removeClass("hide");

        socket.on('joined', function(data) {
            data.playersCount = parseInt(data.playersCount);

            if ($("#playersCount").length > 0) {
                $("#playersCount").text(data.playersCount);
            }

            if (data.playersCount == 4) {
                $("#connect").addClass("hide");
                pong.sync({ hosting: true, playersCount: data.playersCount });
            }
        });
        socket.emit('host', '', function(data) {
            socket.rooms = data.rooms;

            new QRCode(document.getElementById("qrcode"),
                {
                    text: window.location.href+"#"+socket.id,
                    width: 245, height: 245
                });
            $("#gameId").text(socket.id);
        });
    });

    $("#joinGame").click(function () {
        $("#buttonsContainer").addClass("hide");
        $("#formContainer").removeClass("hide");

        if (hash.length > 0) {
            $("#inputGameId").val(hash);
        }
        $("#inputGameId").select();
    });

    $("#joinGameId").click(function () {
        $("#connect").addClass("hide");

        socket.emit('join', $("#inputGameId").val(), function(data) {
            socket.rooms = data.rooms;
            pong.sync({ hosting: false, playersCount: parseInt(data.playersCount) });
        });
    });

    $(window).keypress(function (e) {
        if (e.charCode == 114) {
            window.location.reload(true);
        }
    });

    if (hash.length > 0) {
        $("#joinGame").trigger('click');
    }
});