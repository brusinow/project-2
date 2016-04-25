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

$('#venue-search-btn').click(function(e){
  e.preventDefault();
  var input = $("#search-input");
  var query = input.val();
  console.log(query);
  $.ajax({
    url: '/new-event/result',
    method: 'GET',
    data: {
      q: query,
    },
    done: function(xhr, status, data){
      if(status === 200){
        console.log(data);
      }
    }
  }); 
});