/**utils */
// for real weather use kelvin to celcius
// x - 273.15
// weather status

// clouds: scattered clouds || few clouds || broken clouds || overcast clouds
// rain: light rain || heavy intensity rain || moderate rain || 
// snow: light snow || snow
// sun: clear sky

const endpoint = 'http://api.openweathermap.org/data/2.5/forecast?q=england&appid=b3802f89d6993937f5df1331f19894c5';
const state = {
  count: document.querySelectorAll('.state').length,
}
const time = {
  day: '',
  now: '',
  count: 0,
  weekdays: ['pazar', 'pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi'],
  month: ['ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran', 'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık']
}
const weather = {
  degree: '',
  status: '',
}

function createStatusCapsule(getWeatherStatus) {
  var weatherDivElement = document.createElement('div');
  // clouds
  if (getWeatherStatus === 'scattered clouds' || getWeatherStatus === 'few clouds' || getWeatherStatus ===
    'broken clouds' || getWeatherStatus === 'overcast clouds' || getWeatherStatus === 'clouds' ||
    getWeatherStatus === 'cloud') {
    weatherDivElement.classList.add('cloud');
    // rain
  } else if (getWeatherStatus === 'light rain' || getWeatherStatus === 'heavy intensity rain' ||
    getWeatherStatus === 'moderate rain' || getWeatherStatus === 'rain') {
    var rainElement = document.createElement('li');
    var rainList = document.createElement('ul');
    weatherDivElement.classList.add('rain');
    for (var rainLength = 0; rainLength < 5; rainLength++) {
      rainList.append(rainElement);
    }

    weatherDivElement.append(rainList);
    // snow
  } else if (getWeatherStatus === 'light snow' || getWeatherStatus === 'snow') {
    var snowElement = document.createElement('li');
    snowElement.textContent = '❅';
    weatherDivElement.classList.add('snow');
    var snowList = document.createElement('ul');

    for (var snowLenght = 0; snowLenght < 5; snowLenght++) {
      snowList.append(snowElement);
    }

    weatherDivElement.append(snowList)
    // sun
  } else if (getWeatherStatus === 'clear sky') {
    weatherDivElement.classList.add('sun');
  }

  var divElements = ['state', 'date', 'dateData', 'degree', 'status']
  var spanElements = ['dayNumeric', 'month', 'line', 'day', 'minDegree', 'santigrat', 'maxDegree']

  var getDivElements = divElements.map(element => {
    var creatingElement = document.createElement('div');
    creatingElement.classList.add(element);

    return creatingElement;
  });

  var getSpanElements = spanElements.map(element => {
    var creatingElement = document.createElement('span');
    creatingElement.classList.add(element);

    return creatingElement;
  });

  // min and max add santigrat
  getSpanElements[6].append(getSpanElements[5]);
  getSpanElements[4].append(getSpanElements[5]);

  // degree add min and max
  getDivElements[3].append(getSpanElements[4])
  getDivElements[3].append(getSpanElements[6]);

  // dateData add month line and day
  getDivElements[2].append(getSpanElements[3]);
  getDivElements[2].append(getSpanElements[2]);
  getDivElements[2].append(getSpanElements[1]);

  // date add dateData and dayNumeric
  getDivElements[1].append(getSpanElements[0]);
  getDivElements[1].append(getDivElements[2]);

  // add all elements in pseudo capsule
  getDivElements[0].append(getDivElements[1]);
  getDivElements[0].append(weatherDivElement);
  getDivElements[0].append(getDivElements[3]);
  getDivElements[0].append(getDivElements[4]);

  // add all elements on main container
  document.querySelector('.capsule').append(getDivElements[0]);
}
/**utils*/

fetch(endpoint)
  .then(response => response.json())
  .then(data => {
    ((data || {}).list || []).map(weatherStatus => {
      weather.status = (((weatherStatus || {}).weather || [])[0] || {}).description || '';

      createStatusCapsule(weather.status);
      time.now = new Date(weatherStatus.dt_txt || '');
      weather.degree = (weatherStatus.main || {});

      document.querySelectorAll('.state .degree .minDegree')[time.count].innerText =
        ((weather.degree.temp_min || 0) - 273.15).toFixed('2');
      document.querySelectorAll('.state .degree .maxDegree')[time.count].innerText =
        ((weather.degree.temp_max || 0) - 273.15).toFixed('2');
      document.querySelectorAll('.state .day')[time.count].innerText = time.weekdays[time.now.getDay()];
      document.querySelectorAll('.state .dayNumeric')[time.count].innerText = time.now.getDate()

      document.querySelectorAll('.state .month')[time.count].innerText = time.month[time.now.getMonth()];
      document.querySelectorAll('.state .status')[time.count].innerText = weather.status;
      time.count++;
      time.day = time.now.getDate();
    });
  });
