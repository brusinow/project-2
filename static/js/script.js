

if($('body').is('#today-page')){
  $(document).ready(function() {  
    console.log("Only on today page");
    var lat = $("#coordinates").attr('lat');
    var lng = $("#coordinates").attr('lng');
    if (lat && lng){
    $.ajax({
    url: '/weather',
    method: 'GET',
    data: {
    lat: lat,
    lng: lng
  },

}).done(function(data) {
 
$("#weather-img").attr( "src", '/img/weather/'+data.weatherData.weather[0].icon+'.png' );
console.log($("weather").attr('src'));
$( "#weatherText" ).text(toFahrenheit(data.weatherData.main.temp)+' °F');
});
} 
})
}


// YELP ------------------------//

if($('body').is('#today-page')){
  $(document).ready(function() {  
    var lat = $("#coordinates").attr('lat');
    var lng = $("#coordinates").attr('lng');
    var address = $('#address').text();
    if (lat && lng){
      console.log('Entering AJAX Call');
    $.ajax({
    url: '/yelp',
    method: 'GET',
    data: {
    lat: lat,
    lng: lng,
    address: address
  },

}).done(function(yelpResults) {
  console.log(yelpResults);
  if(yelpResults.yelpFoodData){
    yelpResults.yelpFoodData.businesses.forEach(function(restaurant){
    var restaurantName = "<tr><td><a class='invisible-link' href="+restaurant.mobile_url+"><span class='restaurant-name'>"+restaurant.name+"</span><br>";
    var restaurantReviewStars = "<div class='restaurant-review'><img src="+restaurant.rating_img_url_small+"></div>";
    var restaurantReviewCount = "<div class='restaurant-review-count'>"+restaurant.review_count+" Reviews</div><br>";
    var restaurantAddress = "<span class='restaurant-address'>"+restaurant.location.display_address[0]+", "+restaurant.location.city+"</span></a></td></tr>";
    
  var newRow = $(restaurantName + restaurantReviewStars + restaurantReviewCount + restaurantAddress);
  $(".restaurant-table").append(newRow);        
      }); 
  }
});
} 
})
} 
      
 
           
     





     


$(document).ready(function() {  
       $("#myCarousel").swiperight(function() {  
          $(this).carousel('prev');  
          });  
       $("#myCarousel").swipeleft(function() {  
          $(this).carousel('next');  
     });  
  });  


setTimeout(function () {   window.scrollTo(0, 1); }, 500);


$('#itin-select').change(function() {
  $("table tbody").html("");
  var currentEventId = parseInt($('#itin-select').val());

  $.ajax({
    url: '/edit-itinChange',
    method: 'POST',
    data: {
      currentEventId: currentEventId
    },
    success: function(xhr, status, data){

      console.log(status);
      if(status === 'success'){
     
      var dataParsed = JSON.parse(data.responseText);
     
  dataParsed.events.itinItems.forEach(function(item){
  var newRow = $("<tr><td><a attr='"+item.id+"' href='#' class='delete-link'>Delete</a></td><td>"+item.task+"</td><td style='text-align: right; font-size:12px;'>"+timeFormat(item.startTime)+" - "+timeFormat(item.endTime)+"</td></tr>");
  $("table tbody").append(newRow);        
      }); 
        
      }
    }
  }); 
});



$(document).on( 'click', '.delete-link', function(e){
    e.preventDefault();
    var myID = $(this).attr('attr');
    console.log('click working and id ',myID);
    $.ajax({
        method:'DELETE',
        url:'/edit-itin/delete',
        data: {
          id:myID
        }
    }).success(function(){
       location.reload();
        //redirect or update view
    });
});

$(document).on( 'click', '.delete-link-event', function(e){
    e.preventDefault();
    var myID = $(this).attr('attr');
    console.log('click working and id ',myID);
    $.ajax({
        method:'DELETE',
        url:'/edit-event/show',
        data: {
          id:myID
        }
    }).success(function(){
       window.location.assign("/settings");
        //redirect or update view
    });
});

$(document).on( 'click', '.edit-event-submit', function(e){
    e.preventDefault();
    var myID = $('#hidden-id').val();
    var date = $('#datepicker').val();
    var name = $('#event-venue-name').val();
    var city = $('#event-city').val();
    var address = $('#event-address').val();
    var info = $('#event-info').val();
    console.log('edit click working and id ',myID);
    $.ajax({
        method:'PUT',
        url:'/edit-event/show/',
        data: {
          id: myID,
          date: date,
          venue: name,
          city: city,
          address: address,
          info: info
        }
    }).success(function(){
       window.location.assign("/settings");
        //redirect or update view
    });
});

// $('#itin-select').change(function() {

//   $.get({
//         url: '/edit-itin',
//         data: {events: events}, 
//         success: function(response){
//            console.log('ajax received events are '+ events);
//            console.log('success');
//         }
//     });
//   var newRow = $("<tr><td><td/><td><td/><td><td/></tr>");
//   ("table tbody").append(newRow)
  
    
// });

function timeFormat(hours){
    var letters = 'AM'
    var minutes = '00'
 if (hours === 0 || hours === '0') {
    hours = 12;
    letters = 'AM';
  }  
  else if (hours !== 0 && hours < 12){
    letters = 'AM';
  }
  else if (hours >= 12 && hours < 24){
    hours = hours - 12;
    letters = 'PM';
  }
  else if (hours >= 24 && hours < 36){
    hours = hours -24;
    letters = 'AM';
  }
  else {
    letters = 'error'
  }
    if (hours - Math.floor(hours) === 0){
      minutes = '00'; 
    }
    else if (hours - Math.floor(hours) === .25){
      hours = hours - .25;
      minutes = '15'; 
    }
    else if (hours - Math.floor(hours) === .5){
      hours = hours - .5;
      minutes = '30'; 
    }
    else if (hours - Math.floor(hours) === .75){
      hours = hours - .75;
      minutes = '45'; 
    }
    else {
      minutes = 'error'
    }
  var completeTime = hours +":"+ minutes +" "+ letters;
  return completeTime;
  };

function toFahrenheit(kelvin){
  return Math.round(kelvin * (9/5) - 459.67);
};

$(function () {
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true
    });
});

$('#startTime').timepicker();

$('#endTime').timepicker();
// $('#venue-search-btn').click(function(e){
//   e.preventDefault();
//   var input = $("#search-input");
//   var query = input.val();
//   console.log(query);
//   $.ajax({
//     url: '/new-event/result',
//     method: 'GET',
//     data: {
//       q: query,
//     },
//     success: function(xhr, status, data){
//       console.log(status);
//       if(status === 'success'){
//         $('#venue-list').html("");
//         // console.log(data);
//         // console.log(data.responseJSON.results.length);
//         for (var i=0;i< data.responseJSON.results.length; i++){
//           $('#venue-list').append("<a href='/new-event/result/"+data.responseJSON.results[i].place_id+"'<h4>"+data.responseJSON.results[i].name+"</h4><p>"+data.responseJSON.results[i].formatted_address+"</p></a><br><br>");
//         }
//       }
//     }
//   }); 
// });

// $('#event-add-btn').click(function(e){
//   e.preventDefault();
//   var input = $("#search-input");
//   var query = input.val();
//   console.log(query);
//   $.ajax({
//     url: 'https://maps.googleapis.com/maps/api/geocode/json?address=               key=YOUR_API_KEY',
//     method: 'PUT',
//     data: {
//       q: query,
//     },
//     success: function(xhr, status, data){
//       console.log(status);
//       if(status === 'success'){
//         $('#venue-list').html("");
//         // console.log(data);
//         // console.log(data.responseJSON.results.length);
//         for (var i=0;i< data.responseJSON.results.length; i++){
//           $('#venue-list').append("<a href='/new-event/result/"+data.responseJSON.results[i].place_id+"'<h4>"+data.responseJSON.results[i].name+"</h4><p>"+data.responseJSON.results[i].formatted_address+"</p></a><br><br>");
//         }
//       }
//     }
//   }); 
// });








