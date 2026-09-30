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
