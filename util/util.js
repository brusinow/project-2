module.exports = {
  toFahrenheit: function(kelvin){
    return Math.round(kelvin * (9/5) - 459.67);
  },

  mode: function(array){
      if(array.length == 0)
        return null;
      var modeMap = {};
      var maxEl = array[0], maxCount = 1;
      for(var i = 0; i < array.length; i++)
      {
        var el = array[i];
        if(modeMap[el] == null)
          modeMap[el] = 1;
        else
          modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
          maxEl = el;
          maxCount = modeMap[el];
        }
      }
      console.log(maxEl);
      return maxEl;
  },

  timeFormat: function(hours){
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
  }
};