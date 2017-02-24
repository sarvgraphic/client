var Login = function() {

    var handleLogin = function() {

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                username: {
                    required: "Username is required."
                },
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                form.submit(); // form validation success, call ajax form submit
            }
        });

        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });

        $('.forget-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });

        $('#forget-password').click(function(){
            $('.login-form').hide();
            $('.register-form').hide();
            $('.forget-form').show();

        });
         $('#register').click(function(){
            $('.login-form').hide();
            $('.forget-form').hide();
            $('.register-form').show();

            // mgs script
            $(".user-login-5 .login-container>.login-content").css("margin-top", "0");
            $("#explain").css("display", "none");
        });

        $('#back-btn').click(function(){
            $('.login-form').show();
            $('.register-form').hide();
            $('.forget-form').hide();
        });
        $('#back').click(function(){
            $('.login-form').show();
            $('.register-form').hide();
            $('.forget-form').hide();

            // mgs script
            $(".user-login-5 .login-container>.login-content").css("margin-top", "35%");
            $("#explain").css("display", "block");
        });
    }

 
  

    return {
        //main function to initiate the module
        init: function() {

            handleLogin();

            $('.forget-form').hide();
            $('.register-form').hide();
            // init background slide images
            // $('.login-bg').backstretch([
            //     "resource/images/vendors/adesso/bg1.jpg",
            //     "resource/images/vendors/adesso/bg2.jpg",
            //     "resource/images/vendors/adesso/bg3.jpg",
            //     "resource/images/vendors/adesso/bg4.jpg"
            //     ], {
            //       fade: 1000,
            //       duration: 8000
            //     }
            // );

            //  $('.forget-form').hide();
            //  $('.register-form').hide();
          


        }

    };

}();

jQuery(document).ready(function() {
    Login.init();
});