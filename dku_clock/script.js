// script.js

document.addEventListener('DOMContentLoaded', function () {
    const countdownElement = document.getElementById('countdown');
    const datePicker = document.getElementById('date-picker');
    const weatherContainer = document.getElementById('weather');
    const API_KEY = 'dc9d142f650d1c51243bed90983a8f6d'; // OpenWeatherMap API 키
  
    // 저장된 날짜를 불러와서 D-Day 계산
    chrome.storage.sync.get(['targetDate'], function (result) {
      if (result.targetDate) {
        datePicker.value = result.targetDate;
        updateCountdown(result.targetDate);
      }
    });
  
    // 날짜 선택 시 D-Day 업데이트 및 저장
    datePicker.addEventListener('change', function () {
      const selectedDate = datePicker.value;
      chrome.storage.sync.set({ targetDate: selectedDate });
      updateCountdown(selectedDate);
    });
  
    // D-Day 계산 및 표시
    function updateCountdown(date) {
      const targetDate = new Date(date).getTime();
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (isNaN(targetDate)) {
        countdownElement.textContent = '종강 날짜를 선택하세요';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  
      if (distance < 0) {
        countdownElement.textContent = '종강을 축하합니다!';
      } else {
        setTimeout(() => updateCountdown(date), 1000);
      }
    }
  
    // 날씨 정보 가져오기
    function fetchWeather() {
      const city = 'Yongin'; // 원하는 도시 이름
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if(data.main&&data.main.temp){
            const temp = data.main.temp;
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const temp_min = data.main.temp_min;
            const temp_max = data.main.temp_max;
            weatherContainer.innerHTML = `<p>오늘의 날씨: ${description}</p><p>기온: ${temp}°C</p><p>습도: ${humidity}%<\p><p>최고 기온: ${temp_max}°C<\p><p>최저 기온: ${temp_min}°C<\p>`;
        
          } else{
            console.error('Invalid weather data format');
          }

        })
        .catch(error => console.error('Error fetching weather data:', error));
    }
  
    fetchWeather();


  });
