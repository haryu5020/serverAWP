    function initMap() {
        var myLatLng = {lat:37.631953, lng:127.077841};

        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map'), {
          center: myLatLng,
          scrollwheel: false,
          zoom: 14
        });


        // 마커로 사용할 이미지 주소
        var image = {
            url: "img/map_icon.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        // Create a marker and set its position.
        var marker = new google.maps.Marker({
          map: map,
          icon : image,
          position: myLatLng,
          draggable:false,	
          title: '한빛도서관'
        });
       var infowindow = new google.maps.InfoWindow({ content: "한빛도서관이에요!<br>많이 이용해주세요>_<"});
 
       google.maps.event.addListener(marker, "click", function() {
            infowindow.open(map,marker);
        });
      }