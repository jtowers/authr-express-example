$(document).ready(function () {
    prettyPrint();
    var getSession = function () {
        var request = $.get('sessionExists');
        request.done(function (data) {

            $('#header-username').text(data.username);
            $('#sub1').text('You have been logged in.');
        });
    };
    getSession();
    $('#signup').submit(function (event) {
        event.preventDefault();
        var username = $('#signupun').val();
        var password = $('#signuppw').val();
        var signup = {
            username: username,
            password: password
        };
        var request = $.post('signup', signup);

        request.done(function (data) {

            var user = '<ul>';
            for(var key in data) {
                user = user + '<li>' + key + ": " + data[key] + '</li>';
            }
            user = user + '</ul>';
            $('#signup-message').html($(user));
            $('#signuptoken').val(data.email_verification_hash);
        });

        request.fail(function (jqXHR, textStatus) {

            var alertmsg = '<div class="alert alert-danger" role="alert">' + jqXHR.responseText + '</div>';
            $('#signup-message').html($(alertmsg));
        });
    });

    $('#verify').submit(function (event) {
        event.preventDefault();
        var token = $('#signuptoken').val();
        var request = $.post('verifyToken', {
            token: token
        });

        request.done(function (data) {
            console.log(data);
            var user = '<ul>';
            for(var key in data) {
                user = user + '<li>' + key + ": " + data[key] + '</li>';
            }
            user = user + '</ul>';
            $('#verification-message').html($(user));
        });

        request.fail(function (data, textstatus) {
            var alertmsg = '<div class="alert alert-danger" role="alert">' + data.responseText + '</div>';
            $('#verification-message').html($(alertmsg));
        });
    });

    $('#requesttoken').submit(function (event) {
        event.preventDefault();
        var username = $('#tokenun').val();
        var request = $.post('createResetToken', {
            username: username
        });
        request.done(function (data) {

            $('#resettoken').val(data.password_reset_token);
        });
        request.fail(function (data) {

            var alertmsg = '<div class="alert alert-danger" role="alert">' + data.responseJSON + '</div>';
            $('#reset-message').html($(alertmsg));
        });
    });

    $('#reset_token').submit(function (event) {
        event.preventDefault();
        var url = "verifyToken/" + $('#resettoken').val();
        var request = $.get(url);
        request.done(function (data) {
            $('#pwtoken').val(data.password_reset_token);
        });
        request.fail(function (data) {
            var alertmsg = '<div class="alert alert-danger" role="alert">' + data.responseJSON + '</div>';
            $('#token-message').html($(alertmsg));
        });
    });

    $('#resetpassword').submit(function (event) {
        event.preventDefault();
        var url = 'verifyToken/' + $('#pwtoken').val();
        var email = {
            email: $('#resetpw').val()
        };
        var request = $.post(url, email);
        request.done(function (data) {
            var user = '<ul>';
            for(var key in data) {
                user = user + '<li>' + key + ": " + data[key] + '</li>';
            }
            user = user + '</ul>';
            $('#resetpw-message').html($(user));
        });
        request.fail(function (data) {
            var alertmsg = '<div class="alert alert-danger" role="alert">' + data.responseJSON + '</div>';
            $('#resetpw-message').html($(alertmsg));
        });
    });

    $('#login').submit(function (event) {
        event.preventDefault();
        var username = $('#loginun').val();
        var password = $('#loginpw').val();
        var login = {
            username: username,
            password: password
        };
        var request = $.post('login', login);

        request.done(function (data) {
            var user = '<ul>';
            for(var key in data) {
                user = user + '<li>' + key + ": " + data[key] + '</li>';
            }
            user = user + '</ul>';
            $('#login-message').html($(user));
            getSession();
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        });

        request.fail(function (jqXHR, textStatus) {
            var user;
            var errmsg;
            if(jqXHR.responseJSON.err) {
                errmsg = jqXHR.responseJSON.err;
                user = '<ul>';
                for(var key in jqXHR.responseJSON.user) {
                    user = user + '<li>' + key + ": " + jqXHR.responseJSON.user[key] + '</li>';
                }
                user = user + '</ul>';
            } else {
                errmsg = jqXHR.responseText;
            }
            var alertmsg = '<div class="alert alert-danger" role="alert">' + errmsg + '</div>';
            $('#login-message').html($(alertmsg));
            $('#login-message').append($(user));

        });
    });

    $('#delete').submit(function (event) {
        event.preventDefault();
        var login = {
            username: $('#deleteun').val(),
            password: $('#deletepw').val()
        };
        var request = $.post('delete', login);
        request.done(function (data) {
            var msg = '<div class="alert alert-success">User ' + data.username + ' was deleted.</div>';
            $('#delete-message').html($(msg));
        });
        request.fail(function (data) {
            var msg = '<div class="alert alert-danger">' + data.responseJSON + '<div>';
            $('#delete-message').html($(msg));
        });
    });
});