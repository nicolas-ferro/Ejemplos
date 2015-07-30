$("#submit").click(function() {
        getLocation();
        $(this).replaceWith('<button id="submit" class="btn btn-default"><span class="glyphicon glyphicon-hourglass"></span></button>')
});

function animateHeader() {

  $("header").animate( { height:"175px" }, { queue:false, duration:500 });
  $("#submit").hide();
  $("header p").hide();
  $("header img").animate( { marginLeft:"0px" }, { queue:false, duration:500 });

}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  } else {
    //ERROR SI GEOLOC NO ESTA HABILITADA
  }

  function setPosition(position) {
      latitud=position.coords.latitude;
      longitud=position.coords.longitude;
      getCityName(latitud,longitud);
  } 

}

function getCityName(latitud, longitud) {
  
  url='http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitud+','+longitud+'&sensor=false';
  
  $.getJSON(url, function (data) {
    if (data.status == "OK") {
        var result = data.results;
        var barrio = result[1].address_components[0].long_name;
        var ciudad = result[1].address_components[1].long_name;
        var pais = result[1].address_components[2].long_name;
        console.log('Now looking at pictures from '+barrio+', '+ciudad+', '+pais+' !');
    }
  });
  
  getImages();

}

function getImages() {
$.ajax({
    type: "POST",
    dataType: "jsonp",
    cache: false,
    url: 'https://api.instagram.com/v1/media/search?lat='+latitud+'&lng='+longitud+'&distance=5000&client_id=0fe84796ac174d51a153a084ab609838',

    success: function(instagramImagesData) {
      jsonInstagram = instagramImagesData;
        printImages();
        animateHeader();
    }
  });

//FALTA ERROR HANDLER

}

function printImages() {
  for ( var i = 0; i < 8; i++ ) {

    if (jsonInstagram.data[i] == undefined) {

      return false;

    };

    instaPicture = jsonInstagram.data[i].images.standard_resolution.url;
    instaFullname = jsonInstagram.data[i].user.full_name;
    instaUsername = jsonInstagram.data[i].user.username;
    instaProfilePicture = jsonInstagram.data[i].user.profile_picture;
    instaLikes = jsonInstagram.data[i].likes.count;
    instaComments = jsonInstagram.data[i].comments.count;
    instaLat = jsonInstagram.data[i].location.latitude;
    instaLng = jsonInstagram.data[i].location.longitude;
    instaUserId = jsonInstagram.data[i].user.id;


    instaDatePublished = new Date(jsonInstagram.data[i].created_time * 1000);
    now = new Date();
    secondsPast = (now - instaDatePublished ) / 1000;

    if(secondsPast <= 60){
        instaPublishedOn = 'Imagen publicada hace ' + parseInt(secondsPast) + ' segundos' ;
    }
    if(secondsPast > 60 && secondsPast <= 3600){
        instaPublishedOn = 'Imagen publicada hace ' + parseInt(secondsPast/60) + ' minutos';
    }
    if(secondsPast > 3600 && secondsPast <= 86400){
        instaPublishedOn = 'Imagen publicada hace ' + parseInt(secondsPast/3600) + ' horas';
    }
    if(secondsPast > 86400){
          day = instaDatePublished.getDate();
          month = instaDatePublished.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
          year = instaDatePublished.getFullYear() == now.getFullYear() ? "" :  " "+instaDatePublished.getFullYear();
          instaPublishedOn = 'Publicada el '+day+' '+month+year;
    }

    if (jsonInstagram.data[i].caption == null) {
      instaCaption = '';
      var caption = $('<p></p>');
    } else {
      instaCaption = jsonInstagram.data[i].caption.text;
      var caption = $('<p class="caption">'+instaCaption+'</p>');
    }

    // $.ajax({
    //       type: "POST",
    //       dataType: "jsonp",
    //       cache: false,
    //       url: 'https://api.instagram.com/v1/users/'+instaUserId+'/?client_id=0fe84796ac174d51a153a084ab609838',

    //       success: function(instagramUserData) {
    //         jsonInstagramUser = instagramUserData;
    //           instaUserBio = jsonInstagramUser.data.bio;
    //           instaUserCountsFollow = jsonInstagramUser.data.counts.follows;
    //           instaUserCountsFollowedBy = jsonInstagramUser.data.counts.followed_by;
    //           instaUserMediaCount = jsonInstagramUser.data.counts.media;
    //         }
    //   });

      //FALTA ERROR HANDLER
 
      myUrl='http://maps.googleapis.com/maps/api/geocode/json?latlng='+instaLat+','+instaLng+'&sensor=false';
      
      $.ajax({
      url: myUrl,
      dataType: 'json',
      async: false,
        success: function(data) {
          if (data.status == "OK") {
            var result = data.results;
            var barrio = result[1].address_components[0].long_name;
            var ciudad = result[1].address_components[1].long_name;
            var pais = result[1].address_components[2].long_name;
            instaStreet = result[0].formatted_address;
          }
        }
      });
    

//------------------------ VARS CON LA INFO DEL OVERLAY
    
    var image = $('<div class="image col-xs-12 col-sm-6 col-md-3" style="background-image: url('+instaPicture+')"></div>');
    var overlay = $('<div class="overlay"></div>');
    var profilePicture = $('<img class="img-circle" src="'+instaProfilePicture+'">');
    var profileLink = $('<a class="profileLink" href="https://instagram.com/'+instaUsername+'" target="_blank">@'+instaUsername+'</a>');
    var fullName = $('<h2 class="fullName">'+instaFullname+'</h2>');
    var stats = $('<ul class="stats list-inline"></ul>')
    var likes = $('<li class="likes"><span class="glyphicon glyphicon-heart"></span>'+instaLikes+'</li>');
    var comments = $('<li class="comments"><span class="glyphicon glyphicon-comment"></span>'+instaComments+'</li>');
    var published = $('<p class="published">'+instaPublishedOn+'</p>');
    var modalButton = $('<a class="modalButton" id="modalButton'+i+'" data-toggle="modal" data-target="#modalIndex'+i+'"><span class="glyphicon glyphicon-plus-sign"></span></a>');
    var streets = $('<p>cerca de:</p><p class="streets"><b>'+instaStreet+'</b></p>')

//------------------------ ARMADO DEL OVERLAY

    overlay.append(modalButton);

    image.append(overlay);

//------------------------ VARS CON LA INFO DEL MODAL

    var modal = $('<div class="modal fade" id="modalIndex'+i+'" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"></div>');
    var modalDialog = $('<div class="modal-dialog modal-lg"></div>');
    var modalContent = $('<div class="modal-content"></div>');
    var modalHeader = $('<div class="modal-header"></div>');
    var modalCloseButton = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
    var modalTitle = $('<h4 class="modal-title">Modal title</h4>');
    var modalBody = $('<div class="modal-body"></div>');
    var modalBodyGrid = $('<div class="row"></div>');
    var modalMap = $('<div class="map" id="mapid'+i+'"></div>')
    var modalBodyGridColLeft = $('<div class="col-md-4 col-xs-12 col-sm-12 about"></div>');
    var modalBodyGridColRight = $('<div class="col-md-8 col-xs-12 col-sm-12 modalImage" style="background-image: url('+instaPicture+')"></div>');
    var modalFooter = $('<div class="modal-footer">');

//------------------------ ARMADO DEL MODAL ABOUT
   
    stats.append(likes);
    stats.append(comments);

    modalBodyGridColLeft.append(modalCloseButton);
    modalBodyGridColLeft.append(profilePicture);
    modalBodyGridColLeft.append(fullName);
    modalBodyGridColLeft.append(profileLink);
    modalBodyGridColLeft.append(stats);
    modalBodyGridColLeft.append(published);
    modalBodyGridColLeft.append(streets);

    modalBodyGridColRight.append(caption);

//------------------------ ARMADO DEL MODAL

    modalBodyGrid.append(modalBodyGridColLeft);
    modalBodyGrid.append(modalBodyGridColRight);

    modalBody.append(modalBodyGrid);

    // modalHeader.append(modalCloseButton);
    // modalHeader.append(modalTitle);

    // modalContent.append(modalHeader);
    modalContent.append(modalBody);
    // modalContent.append(modalFooter);

    modalDialog.append(modalContent);
    modal.append(modalDialog);

    $('.galeria').append(image);
    $('.galeria').append(modal);


//------------------------ ARMADO DEL MAPA

  var map;
  var mapid = "mapid"+i;
  var modalIndex = "#modalIndex"+i;

  function initialize() {
    var styles = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];

    var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});

    var myLatlng = new google.maps.LatLng(instaLat,instaLng);
    var mapOptions = {
      mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      },
      zoom: 14,
      center: myLatlng,
      disableDefaultUI: true,
    }

    var map = new google.maps.Map(document.getElementById(mapid), mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Hello World!',
        icon: 'img/location.png', 
    });

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    $(modalIndex).on('shown.bs.modal', function () {
      var currCenter = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(currCenter);
    })
  }


//------------------------ ARMADO DEL MAPA

  };
          
}

