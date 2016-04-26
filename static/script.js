function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

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










