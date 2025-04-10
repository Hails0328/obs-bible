
async function loadVerse() {
  const params = new URLSearchParams(window.location.search || localStorage.getItem('verseRef'));
  const book = params.get('book');
  const chapter = params.get('chapter');
  const start = parseInt(params.get('start'), 10);
  const end = parseInt(params.get('end'), 10);

  const res = await fetch('https://hails0328.github.io/bible-obs-plugin/EntireBible-DR.json');
  const bible = await res.json();

  const verses = bible[book]?.[chapter];
  if (!verses) {
    document.getElementById('verseDisplay').innerText = "❌ Verse not found.";
    return;
  }

  const output = [];
  for (let i = start; i <= end; i++) {
    if (verses[i]) {
      output.push(`<p><strong>${book} ${chapter}:${i}</strong> ${verses[i]}</p>`);
    }
  }

  document.getElementById('verseDisplay').innerHTML = output.join('');
}

loadVerse();

  const style = JSON.parse(localStorage.getItem('bibleStyle') || '{}');
  const container = document.getElementById('verseDisplay');
  if (style.font) container.style.fontFamily = style.font;
  if (style.fontSize) container.style.fontSize = style.fontSize + 'px';
  if (style.align) container.style.textAlign = style.align;
