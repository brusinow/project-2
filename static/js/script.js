
$(document).on( 'click', '#login-button', function(e){
  e.preventDefault();
  var now = moment().format('MM/DD/YYYY');
  var nowText = moment().format('MMMM Do, YYYY');
  var thisDayOfWeek = moment().format('dddd');

  console.log(typeof myDate);
  var email = $("#login-email").val();
  var password = $("#login-password").val();
    $.ajax({
    url: '/',
    method: 'POST',
    data: {
    now: now,
    nowText: nowText,
    thisDayOfWeek: thisDayOfWeek,
    email: email, 
    password: password  
  },

}).success(function(data) {
console.log("success on login button");
window.location.assign("/today");
});
});


// if($('body').is('#today-page')){
// (function currentTime(){
// console.log('function is called')

//  console.log(now);
//  console.log(nowText);
//  console.log(thisDayOfWeek)
// })()
// };



// WEATHER --------------------------------//

if($('body').is('#today-page')){
  (function() {  
    // console.log("Only on today page");
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

$( "#weatherText" ).text(toFahrenheit(data.weatherData.main.temp)+' °F');
});
} 
})()
}


// YELP Main Results ------------------------//

if($('body').is('#today-page')){
  (function() {  
    var lat = $("#coordinates").attr('lat');
    var lng = $("#coordinates").attr('lng');
    var address = $('#address').text();
    if (lat && lng){

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
    var restaurantName = "<tr><td><a class='invisible-link' href="+restaurant.mobile_url+"><span class='yelp-name'>"+restaurant.name+"</span><br>";
    var restaurantReviewStars = "<div class='yelp-review'><img src="+restaurant.rating_img_url_small+"></div>";
    var restaurantReviewCount = "<div class='yelp-review-count'>"+restaurant.review_count+" Reviews</div><br>";
    var restaurantAddress = "<span class='yelp-address'>"+restaurant.location.display_address[0]+", "+restaurant.location.city+"</span></a></td>";
    var restaurantDistance = "<td class='text-right'><span class='yelp-distance'>"+metersToMiles(restaurant.distance)+" mi</span><br>";
    var restaurantCategory = "<span class='yelp-category'>"+restaurant.categories[0][0]+"</span></td></tr>"

  var newRow = $(restaurantName + restaurantReviewStars + restaurantReviewCount + restaurantAddress + restaurantDistance + restaurantCategory);
  $(".restaurant-table").append(newRow); 
  $('#food-header').text('Food:');       
      }); 
  }
  if(yelpResults.yelpCoffeeData){
    yelpResults.yelpCoffeeData.businesses.forEach(function(coffeeShop){
    var coffeeName = "<tr><td><a class='invisible-link' href="+coffeeShop.mobile_url+"><span class='yelp-name'>"+coffeeShop.name+"</span><br>";
    var coffeeReviewStars = "<div class='yelp-review'><img src="+coffeeShop.rating_img_url_small+"></div>";
    var coffeeReviewCount = "<div class='yelp-review-count'>"+coffeeShop.review_count+" Reviews</div><br>";
    var coffeeAddress = "<span class='yelp-address'>"+coffeeShop.location.display_address[0]+", "+coffeeShop.location.city+"</span></a></td>";
    var coffeeDistance = "<td class='text-right'><span class='yelp-distance'>"+metersToMiles(coffeeShop.distance)+" mi</span><br>";
    var coffeeCategory = "<span class='yelp-category'>"+coffeeShop.categories[0][0]+"</span></td></tr>"

  var newRow = $(coffeeName + coffeeReviewStars + coffeeReviewCount + coffeeAddress + coffeeDistance + coffeeCategory);
  $(".coffee-table").append(newRow);  
  $('#coffee-header').text('Coffee/Tea:');       
      }); 
  }
  if(yelpResults.yelpGymData){
    yelpResults.yelpGymData.businesses.forEach(function(gym){
    var gymName = "<tr><td><a class='invisible-link' href="+gym.mobile_url+"><span class='yelp-name'>"+gym.name+"</span><br>";
    var gymReviewStars = "<div class='yelp-review'><img src="+gym.rating_img_url_small+"></div>";
    var gymReviewCount = "<div class='yelp-review-count'>"+gym.review_count+" Reviews</div><br>";
    var gymAddress = "<span class='yelp-address'>"+gym.location.display_address[0]+", "+gym.location.city+"</span></a></td>";
    var gymDistance = "<td class='text-right'><span class='yelp-distance'>"+metersToMiles(gym.distance)+" mi</span><br>";
    var gymCategory = "<span class='yelp-category'>"+gym.categories[0][0]+"</span></td></tr>"

  var newRow = $(gymName + gymReviewStars + gymReviewCount + gymAddress + gymDistance + gymCategory);
  $(".gym-table").append(newRow);   
  $('#gym-header').text('Gym:');      
      }); 
  }
});

} 
})()
}; 
      

// YELP Activities Results ------------------------//

if($('body').is('#today-page')){
  (function() {  
    var lat = $("#coordinates").attr('lat');
    var lng = $("#coordinates").attr('lng');
    var address = $('#address').text();
    if (lat && lng){
  
    $.ajax({
    url: '/yelp/activities',
    method: 'GET',
    data: {
    lat: lat,
    lng: lng,
    address: address
  },

}).done(function(yelpResults) {
  console.log(yelpResults);
  if(yelpResults.yelpBookData){
    yelpResults.yelpBookData.businesses.forEach(function(bookstore){
    var bookstoreName = "<tr><td><a class='invisible-link' href="+bookstore.mobile_url+"><span class='yelp-name'>"+bookstore.name+"</span><br>";
    var bookstoreReviewStars = "<div class='yelp-review'><img src="+bookstore.rating_img_url_small+"></div>";
    var bookstoreReviewCount = "<div class='yelp-review-count'>"+bookstore.review_count+" Reviews</div><br>";
    var bookstoreAddress = "<span class='yelp-address'>"+bookstore.location.display_address[0]+", "+bookstore.location.city+"</span></a></td>";
    var bookstoreDistance = "<td class='text-right'><span class='yelp-distance'>"+metersToMiles(bookstore.distance)+" mi</span><br>";
    var bookstoreCategory = "<span class='yelp-category'>"+bookstore.categories[0][0]+"</span></td></tr>"

  var newRow = $(bookstoreName + bookstoreReviewStars + bookstoreReviewCount + bookstoreAddress + bookstoreDistance + bookstoreCategory);
  $(".bookstore-table").append(newRow); 
  $('#book-header').text('Bookstore:');       
      }); 
  }
  if(yelpResults.yelpMovieData){
    yelpResults.yelpMovieData.businesses.forEach(function(theater){
    var theaterName = "<tr><td><a class='invisible-link' href="+theater.mobile_url+"><span class='yelp-name'>"+theater.name+"</span><br>";
    var theaterReviewStars = "<div class='yelp-review'><img src="+theater.rating_img_url_small+"></div>";
    var theaterReviewCount = "<div class='yelp-review-count'>"+theater.review_count+" Reviews</div><br>";
    var theaterAddress = "<span class='yelp-address'>"+theater.location.display_address[0]+", "+theater.location.city+"</span></a></td>";
    var theaterDistance = "<td class='text-right'><span class='yelp-distance'>"+metersToMiles(theater.distance)+" mi</span><br>";
    var theaterCategory = "<span class='yelp-category'>"+theater.categories[0][0]+"</span></td></tr>"

  var newRow = $(theaterName + theaterReviewStars + theaterReviewCount + theaterAddress + theaterDistance + theaterCategory);
  $(".movie-table").append(newRow);  
  $('#movie-header').text('Movie Theater:');       
      }); 
  }

});
} 
})()
}; 

// Yelp EMERGENCY Results----------------------------//
     
if($('body').is('#today-page')){
  (function() {  
    var lat = $("#coordinates").attr('lat');
    var lng = $("#coordinates").attr('lng');
    var address = $('#address').text();
    if (lat && lng){
      console.log('Entering AJAX Call');
    $.ajax({
    url: '/yelp/emergency',
    method: 'GET',
    data: {
    lat: lat,
    lng: lng,
    address: address
  },

}).done(function(yelpResults) {
  if(yelpResults.yelpPharmacyData){
    yelpResults.yelpPharmacyData.businesses.forEach(function(pharmacy){
    var pharmacyName = "<tr><td><a class='invisible-link' href="+pharmacy.mobile_url+"><span class='yelp-name'>"+pharmacy.name+"</span><br>";
    var pharmacyReviewStars = "<div class='yelp-review'><img src="+pharmacy.rating_img_url_small+"></div>";
    var pharmacyReviewCount = "<div class='yelp-review-count'>"+pharmacy.review_count+" Reviews</div><br>";
    var pharmacyAddress = "<span class='yelp-address'>"+pharmacy.location.display_address[0]+", "+pharmacy.location.city+"</span></a></td>";
    var pharmacyDistance = "<td class='text-right'><span class='yelp-distance'>"+metersToMiles(pharmacy.distance)+" mi</span><br>";
    var pharmacyCategory = "<span class='yelp-category'>"+pharmacy.categories[0][0]+"</span><br>"
    var displayPharmacyPhone = pharmacy.display_phone.slice(3);
    var pharmacyPhone = "<span class='yelp-phone'><a href='tel:"+pharmacy.display_phone+"'>"+displayPharmacyPhone+"</a></span></td></tr>"

  var newRow = $(pharmacyName + pharmacyReviewStars + pharmacyReviewCount + pharmacyAddress + pharmacyDistance + pharmacyCategory + pharmacyPhone);
  $(".pharmacy-table").append(newRow); 
  $('#pharmacy-header').text('Pharmacy:');       
      }); 
  }
  if(yelpResults.yelpHospitalData){
    yelpResults.yelpHospitalData.businesses.forEach(function(hospital){
    var hospitalName = "<tr><td><a class='invisible-link' href="+hospital.mobile_url+"><span class='yelp-name'>"+hospital.name+"</span><br>";
    var hospitalReviewStars = "<div class='yelp-review'><img src="+hospital.rating_img_url_small+"></div>";
    var hospitalReviewCount = "<div class='yelp-review-count'>"+hospital.review_count+" Reviews</div><br>";
    var hospitalAddress = "<span class='yelp-address'>"+hospital.location.display_address[0]+", "+hospital.location.city+"</span></a></td>";
    var hospitalDistance = "<td class='text-right'><span class='yelp-distance'>"+metersToMiles(hospital.distance)+" mi</span><br>";
    var hospitalCategory = "<span class='yelp-category'>"+hospital.categories[0][0]+"</span><br>"
    var displayHospitalPhone = hospital.display_phone.slice(3);
    
    var hospitalPhone = "<span class='yelp-phone'><a href='tel:"+hospital.display_phone+"'>"+displayHospitalPhone+"</a></span></td></tr>"
  var newRow = $(hospitalName + hospitalReviewStars + hospitalReviewCount + hospitalAddress + hospitalDistance + hospitalCategory + hospitalPhone);
  $(".hospital-table").append(newRow);   
  $('#hospital-header').text('Hospital:');      
      }); 
  }

  if(yelpResults.yelpClinicData){
    yelpResults.yelpClinicData.businesses.forEach(function(clinic){
    var clinicName = "<tr><td><a class='invisible-link' href="+clinic.mobile_url+"><span class='yelp-name'>"+clinic.name+"</span><br>";
    var clinicReviewStars = "<div class='yelp-review'><img src="+clinic.rating_img_url_small+"></div>";
    var clinicReviewCount = "<div class='yelp-review-count'>"+clinic.review_count+" Reviews</div><br>";
    var clinicAddress = "<span class='yelp-address'>"+clinic.location.display_address[0]+", "+clinic.location.city+"</span></a></td>";
    var clinicDistance = "<td class='text-right'><span class='yelp-distance'>"+metersToMiles(clinic.distance)+" mi</span><br>";
    var clinicCategory = "<span class='yelp-category'>"+clinic.categories[0][0]+"</span><br>"
    var displayClinicPhone = clinic.display_phone.slice(3);
    var clinicPhone = "<span class='yelp-phone'><a href='tel:"+clinic.display_phone+"'>"+displayClinicPhone+"</a></span></td></tr>"


  var newRow = $(clinicName + clinicReviewStars + clinicReviewCount + clinicAddress + clinicDistance + clinicCategory + clinicPhone);
  $(".clinic-table").append(newRow);  
  $('#clinic-header').text('Urgent Care Clinic:');       
      }); 
  }
  
});

} 
})()
}; 




$(document).on( 'click', '#food-button', function(e){
  console.log("food button");
document.getElementById("food-row").className = "row";
document.getElementById("coffee-row").className = "row";
document.getElementById("gym-row").className = "row hidden";
document.getElementById("book-row").className = "row hidden";
document.getElementById("movie-row").className = "row hidden";
document.getElementById("pharmacy-row").className = "row hidden";
document.getElementById("clinic-row").className = "row hidden";
document.getElementById("hospital-row").className = "row hidden";
})

$(document).on( 'click', '#activities-button', function(e){
  console.log("activity button");
document.getElementById("food-row").className = "row hidden";
document.getElementById("coffee-row").className = "row hidden";
document.getElementById("gym-row").className = "row";
document.getElementById("book-row").className = "row";
document.getElementById("movie-row").className = "row";
document.getElementById("pharmacy-row").className = "row hidden";
document.getElementById("clinic-row").className = "row hidden";
document.getElementById("hospital-row").className = "row hidden";
})

$(document).on( 'click', '#emergency-button', function(e){
  console.log("emergency button");
document.getElementById("food-row").className = "row hidden";
document.getElementById("coffee-row").className = "row hidden";
document.getElementById("gym-row").className = "row hidden";
document.getElementById("book-row").className = "row hidden";
document.getElementById("movie-row").className = "row hidden";
document.getElementById("pharmacy-row").className = "row";
document.getElementById("clinic-row").className = "row";
document.getElementById("hospital-row").className = "row";
})





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
        url:'/edit-event/delete',
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


$(document).on( 'click', '.accept-link', function(e){
    e.preventDefault();
    var userId = $(this).attr('user');
    console.log(userId)
    console.log('edit click working and id ',userId);
    $.ajax({
        method:'POST',
        url:'/accept',
        data: {
          userId: userId,
        }
    }).success(function(){
         console.log("success")
        //redirect or update view
    });
});

$(document).on( 'click', '.accept-link', function(e){
    e.preventDefault();
    var userId = $(this).attr('user');
    console.log("front end delete userId is: ",userId)
 
    $.ajax({
        method:'DELETE',
        url:'/accept',
        data: {
          userId: userId
        }
    }).success(function(){
         window.location.assign("/pending");
        //redirect or update view
    });
});


$(document).on( 'click', '.decline-link', function(e){
    e.preventDefault();
    var userId = $(this).attr('user');
    console.log("front end delete userId is: ",userId)
 
    $.ajax({
        method:'DELETE',
        url:'/decline',
        data: {
          userId: userId
        }
    }).success(function(){
         window.location.assign("/pending");
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

function metersToMiles(distance) {
      var result = distance * 0.000621371192;
     return Math.round( result * 10 ) / 10; 
}

$(function () {
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true
    });
});

$('#startTime').timepicker();

$('#endTime').timepicker();




// $(document).on( 'click', '#venue-address', function(e){
//     e.preventDefault();
//   console.log("clickity bidness");
//   var venueName = $("#venue-name");
//   var venueNameText = venueName.val();
//   var venueCity = $("#venue-city");
//   var venueCityText = venueCity.val();
//     $.ajax({
//         method:'GET',
//         url:'/google',
//         data: {
//           venueName: venueNameText,
//           venueCity: venueCityText
//         }
//     }).success(function(){
//          console.log("success")
//         $('#google-places-div').html("");
//         console.log(data);
//         //redirect or update view
//     });
// });

$(document).on( 'click', '#venue-address', function(e){
if ($("#venue-address").val().length === 0 && $("#venue-name").val().length > 0){
  $('#venue-address').addClass('loadinggif');
    $("#google-places-div table tbody").html("");
  console.log("clickity bidness");
  var venueName = $("#venue-name");
  var venueNameText = venueName.val();
  var venueCity = $("#venue-city");
  var venueCityText = venueCity.val();
  $.ajax({
    url: '/google',
    method: 'GET',
    data: {
      venueName: venueNameText,
      venueCity: venueCityText
    },
    success: function(xhr, status, data){

      console.log(status);
      if(status === 'success'){
       $('#venue-address').removeClass('loadinggif');
     console.log(data.responseJSON.results);
      for (var i=0;i< data.responseJSON.results.length && i < 4; i++){
      var newRow = $("<tr><td style='border: none;'><a attr='"+data.responseJSON.results[i].formatted_address+"' href='#'>"+data.responseJSON.results[i].formatted_address+"<br>("+data.responseJSON.results[i].name+")</a></td></tr>");
      
    $("#google-places-div table tbody").append(newRow);
    $("#google-places-div").fadeIn(500);     
    // document.getElementById("google-places-div").className = "venue-suggestions";
  };
  var refine = $("<tr><td style='border: none;'>Don't see your venue here? Refine your search.</td></tr>");
   $("#google-places-div table tbody").append(refine);
  // dataParsed.events.itinItems.forEach(function(item){
  // var newRow = $("");
  // $("table tbody").append(newRow);        
      // }); 
        
      }
    }
  }); 
  }
}); 



$(document).on( 'click', '#google-places-div a', function(e){

  // document.getElementById("google-places-div").className = "hidden venue-suggestions";
  e.preventDefault();
  $("#google-places-div").fadeOut(500);
  var address = $(this).attr('attr');
  $("#venue-address").val(address);

});


$(document).on( 'click', '#clear-venue-address', function(e){
  $("#google-places-div").fadeOut();
  $("#venue-address").val("");
});

$(document).on( 'click', '#clear-venue-city', function(e){
  $("#google-places-div").fadeOut();
  $("#venue-city").val("");
});

$(document).on( 'click', '#clear-venue-name', function(e){
  $("#google-places-div").fadeOut();
  $("#venue-name").val("");
});

if($('body').is('#new-event-page')){
  $(document).ready(function() {  
    $("#google-places-div").hide();
  });
}
// $('#venue-address').click(function(e){
//   e.preventDefault();
//   console.log("clickity bidness");
//   var venueName = $("#venue-name");
//   var venueNameText = venueName.val();
//   var venueCity = $("#venue-city");
//   var venueCityText = venueCity.val();
//  $.ajax({
//     url: "/venue-recommendations",
//     console.log(url);
//     method: 'GET',
//     data: {
//       name: venueNameText,
//       city: venueCityText
//     },
//     success: function(xhr, status, data){
//       console.log(status);
//       if(status === 'success'){
//         $('#google-places-div').html("");
//         console.log(data.responseJSON);
        // console.log(data.responseJSON.results.length);
        // for (var i=0;i<6; i++){
        //   $('#google-places-div').append("<a href='/new-event/result/"+data.responseJSON.results[i].place_id+"'<h4>"+data.responseJSON.results[i].name+"</h4><p>"+data.responseJSON.results[i].formatted_address+"</p></a><br><br>");
        // }
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








