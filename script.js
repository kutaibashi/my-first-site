const themeButton = document.querySelector('#theme-button');

function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  themeButton.setAttribute('aria-pressed', String(isDark));
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem('theme');
} catch (error) {
  console.warn('تعذّرت قراءة الاختيار المحفوظ', error);
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

themeButton.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark-mode');
  applyTheme(isDark);
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  } catch (error) {
    console.warn('تعذّر حفظ الاختيار', error);
  }
});

const cities = [
  { name: 'دمشق', lat: 33.51, lon: 36.29 },
  { name: 'الرياض', lat: 24.71, lon: 46.68 },
  { name: 'برلين', lat: 52.52, lon: 13.40 },
];

async function loadWeather() {
  const list = document.querySelector('#weather-list');
  const url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=' + cities.map((c) => c.lat).join(',')
    + '&longitude=' + cities.map((c) => c.lon).join(',')
    + '&current=temperature_2m,wind_speed_10m';

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      throw new Error('ردّ الخادم برمز ' + response.status);
    }
    const data = await response.json();
    list.replaceChildren();
    data.forEach((place, i) => {
      const item = document.createElement('li');
      item.textContent = cities[i].name + ': ' + place.current.temperature_2m
        + ' درجة، والرياح ' + place.current.wind_speed_10m + ' كم/سا';
      list.append(item);
    });
  } catch (error) {
    list.replaceChildren();
    const item = document.createElement('li');
    item.textContent = 'تعذّر جلب الطقس الآن. (' + error.message + ')';
    list.append(item);
  }
}

loadWeather();
