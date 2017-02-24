
myApp.controllerProvider.register('DetailCtrl', function($scope, $stateParams, $timeout, imageService, settings) {
    $scope.path = settings.path.pathAppApi;
    $scope.date = new Date().getTime();
    $scope.radioValue = 'btn1';
    $scope.showTable = true;
    $scope.changeMode = function(status){
        if(status == 'btn1'){
            $scope.showTable = true;
            $scope.radioTable = '';
        }else{
            $scope.showTable = false;
            $scope.radioTable = 'table-3';
            $timeout(function(){
                $scope.$apply()
            },10)
        }
    };


    $('#myDropdown .dropdown-menu').on({
        "click":function(e){
            e.stopPropagation();
        }
    });



    async.auto({
        startLoading : function(cb){
            cb(null,true);

        },
        getImage : ['startLoading', function(cb, result){
            var option = {
                data: {
                    scope: 'website',
                    id : $stateParams.id
                }
            };
            console.log("option : ", option)
            imageService.getOneImage(option).then(function(resp){
                console.log("resp : ", resp)
                cb(null, resp);
            }).catch(function(err){
                console.log(err)
                cb(err);
            })

        }]

    }, function(err, result){
        if(err){
            console.log("error : ", err);
        }else{
            $scope.detailData = result.getImage['data'];
            $timeout(function(){
                $scope.$apply();
            })
        }
    })

    $scope.close = function(){
        $("#myDropdown").removeClass('in open');
    };

    $scope.tableRadio = function(radioSelected){
        $scope.radioTable = radioSelected;
    };

    $scope.tableSize = [
        {
            name : "small",
            size : "500 x 293 px",
            dpi : "6.9\" x 4.1\" (72dpi)",
            id:1,
            weight : "228 KB"
        },
        {
            name : "medium",
            size : "1000 x 585 px",
            dpi : "3.3\" x 2.0\" (300dpi)",
            id:2,
            weight : "774 KB"
        },
        {
            name : "large",
            size : "2750 x 1609 px",
            dpi : "9.2\" x 5.4\" (300dpi)",
            id:3,
            weight : "12.7 MB"
        },
        {
            name : "supersize",
            size : "5500 x 3218 px",
            dpi : "18.3\" x 10.7\" (300dpi)",
            id:4,
            weight : "50.6 MB"
        }
    ];



    $scope.images = [
        {
            'images' : 'http://thumb7.shutterstock.com/display_pic_with_logo/2478739/436458775/stock-photo--map-pin-flat-above-blue-tone-city-scape-and-network-connection-concept-436458775.jpg',
            'id' : 0,
            'title' : 'Map pin flat above blue tone city scape and network connection concept'
        },
        {
            'images' : 'http://thumb7.shutterstock.com/display_pic_with_logo/2478739/436458775/stock-photo--map-pin-flat-above-blue-tone-city-scape-and-network-connection-concept-436458775.jpg',
            'id' : 1,
            'title' : 'Map pin flat above blue tone city scape and network connection concept'
        },
        {
            'images' : 'http://thumb1.shutterstock.com/display_pic_with_logo/461077/351597794/stock-photo-businessman-holding-digital-image-of-infographs-in-hand-351597794.jpg',
            'id' : 2,
            'title' : 'Businessman holding digital image of infographs in hand'
        },
        {
            'images' : 'http://thumb7.shutterstock.com/display_pic_with_logo/752872/437204275/stock-photo-city-scape-and-network-connection-concept-437204275.jpg',
            'id' : 3,
            'title' : 'city scape and network connection concept'
        },{
            'images' : 'http://thumb1.shutterstock.com/display_pic_with_logo/461077/354363110/stock-photo-glass-glowing-light-bulb-and-business-sketched-ideas-354363110.jpg',
            'id' : 4,
            'title' : 'Glass glowing light bulb and business sketched ideas'
        },{
            'images' : 'http://thumb9.shutterstock.com/display_pic_with_logo/2478739/400698682/stock-photo-blue-tone-city-scape-and-network-connection-concept-400698682.jpg',
            'id' : 5,
            'title' : 'blue tone city scape and network connection concept '
        },{
            'images' : 'http://thumb1.shutterstock.com/display_pic_with_logo/787933/394753777/stock-photo-plan-for-electronic-business-394753777.jpg',
            'id' : 6,
            'title' : 'Plan for electronic business'
        },{
            'images' : 'http://thumb7.shutterstock.com/display_pic_with_logo/461077/331510229/stock-photo-human-hand-holding-shining-electric-bulb-and-infographs-on-wall-331510229.jpg',
            'id' : 7,
            'title' : 'Human hand holding shining electric bulb and infographs on wall'
        },{
            'images' : 'http://thumb1.shutterstock.com/display_pic_with_logo/461077/456767407/stock-photo-new-technologies-for-business-mixed-media-456767407.jpg',
            'id' : 8,
            'title' : 'New technologies for business  . Mixed media'
        },{
            'images' : 'http://thumb1.shutterstock.com/display_pic_with_logo/461077/348513503/stock-photo-close-up-of-business-person-investigating-infographs-with-magnifier-348513503.jpg',
            'id' : 9,
            'title' : 'Close up of business person investigating infographs with magnifier'
        },{
            'images' : 'http://thumb7.shutterstock.com/display_pic_with_logo/461077/340351991/stock-photo-rear-view-of-businessman-drawing-with-marker-infographs-on-wall-340351991.jpg',
            'id' : 10,
            'title' : 'Rear view of businessman drawing with marker infographs on wall'
        },{
            'images' : 'http://thumb1.shutterstock.com/display_pic_with_logo/461077/356363414/stock-photo-close-view-of-businessman-touching-screen-with-market-infographs-356363414.jpg',
            'id' : 11,
            'title' : 'Close view of businessman touching screen with market infographs'
        },{
            'images' : 'http://thumb7.shutterstock.com/display_pic_with_logo/461077/338918705/stock-photo-rear-view-of-businesswoman-looking-at-infographs-on-wall-338918705.jpg',
            'id' : 12,
            'title' : 'Rear view of businesswoman looking at infographs on wall'
        },{
            'images' : 'http://thumb1.shutterstock.com/display_pic_with_logo/461077/352153697/stock-photo-rear-view-of-businessman-with-suitcase-and-infographs-on-virtual-panel-352153697.jpg',
            'id' : 13,
            'title' : 'Rear view of businessman with suitcase and infographs on virtual panel'
        },{
            'images' : 'http://thumb1.shutterstock.com/display_pic_with_logo/461077/461433733/stock-photo-bright-idea-for-success-mixed-media-461433733.jpg',
            'id' : 14,
            'title' : 'Bright idea for success . Mixed media'
        }

    ];

    $scope.detail = $scope.images[$stateParams.id];
    $timeout(function(){
        ContentFancybox.init();
    },100)



    $("#similar-image").owlCarousel({
        items: 1,
        nav: false,
        navText: ['', ''],
        dots: true,
        //animateIn: 'fadeIn',
        //animateOut: 'fadeOut',
        //loop: true,
        smartSpeed: 450,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        autoplaySpeed: 5000,
        responsive: {
            0: {
                items: 1
            }, 450: {
                items: 3
            }, 767: {
                items: 4
            }, 991: {
                items: 6
            }, 1199: {
                items: 8
            }
        }
    });



});