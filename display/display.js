
function applySavedStyle() {
  const style = JSON.parse(localStorage.getItem('bibleStyle') || '{}');
  const container = document.getElementById('verseDisplay');
  if (style.font) container.style.fontFamily = style.font;
  if (style.fontSize) container.style.fontSize = style.fontSize + 'px';
  if (style.align) container.style.textAlign = style.align;
}

async function loadVerse() {
  const params = new URLSearchParams(
    window.location.search || localStorage.getItem('verseRef') || 'book=Proverbs&chapter=3&start=5&end=6'
  );
  const book = params.get('book');
  const chapter = params.get('chapter');
  const start = parseInt(params.get('start'), 10);
  const end = parseInt(params.get('end'), 10);

  if (!book || !chapter || isNaN(start) || isNaN(end)) {
    document.getElementById('verseDisplay').innerText = "⚠️ Please select a verse using the Bible Dock first.";
    return;
  }

  const res = await fetch('https://hails0328.github.io/bible-obs-plugin/EntireBible-DR.json');
  const bible = await res.json();

  const verses = bible[book]?.[chapter];
  if (!verses) {
    document.getElementById('verseDisplay').innerText = "❌ Chapter not found.";
    return;
  }

  const output = [];
  for (let i = start; i <= end; i++) {
    if (verses[i]) {
      output.push(`<p><strong>${book} ${chapter}:${i}</strong> ${verses[i]}</p>`);
    }
  }

  if (output.length === 0) {
    document.getElementById('verseDisplay').innerText = "⚠️ No verses found in this range.";
    return;
  }

  document.getElementById('verseDisplay').innerHTML = output.join('');
  applySavedStyle();
}

loadVerse();

window.addEventListener("storage", (event) => {
  if (event.key === "bibleUpdated") loadVerse();
  if (event.key === "bibleStyle") applySavedStyle();
});
