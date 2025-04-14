
function applySavedStyle() {
  const style = JSON.parse(localStorage.getItem('bibleStyle') || '{}');
  const container = document.getElementById('verseDisplay');
  if (style.font) container.style.fontFamily = style.font;
  if (style.fontSize) container.style.fontSize = style.fontSize + 'px';
  if (style.align) container.style.textAlign = style.align;

  switch (style.shadow) {
    case 'soft':
      container.style.textShadow = '0 0 8px rgba(255,255,255,0.5)';
      break;
    case 'hard':
      container.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
      break;
    default:
      container.style.textShadow = 'none';
  }

  if (style.opacity !== undefined) {
    container.style.backgroundColor = `rgba(0, 0, 0, ${style.opacity})`;
  }
}

async function loadVerse() {
  console.log("🔄 Loading verse...");
  const params = new URLSearchParams(
    window.location.search || localStorage.getItem('verseRef') || 'book=Proverbs&chapter=3&start=5&end=6'
  );
  const book = params.get('book');
  const chapter = params.get('chapter');
  const start = parseInt(params.get('start'), 10);
  const end = parseInt(params.get('end'), 10);
  console.log("➡️ Selected:", { book, chapter, start, end });

  const container = document.getElementById('verseDisplay');

  if (!book || !chapter || isNaN(start) || isNaN(end)) {
    container.innerText = "⚠️ Please select a verse using the Bible Dock first.";
    return;
  }

  const res = await fetch('https://hails0328.github.io/bible-obs-plugin/EntireBible-DR.json');
  const bible = await res.json();

  const verses = bible[book]?.[chapter];
  if (!verses) {
    container.innerText = "❌ Chapter not found.";
    return;
  }

  const output = [];
  for (let i = start; i <= end; i++) {
    if (verses[i]) {
      output.push(`<p><strong>${book} ${chapter}:${i}</strong> ${verses[i]}</p>`);
    }
  }

  if (output.length === 0) {
    container.innerText = "⚠️ No verses found in this range.";
    return;
  }

  container.innerHTML = output.join('');
  applySavedStyle();
  console.log("✅ Display updated.");
}

loadVerse();

window.addEventListener("storage", (event) => {
  if (event.key === "bibleUpdated") {
    console.log("📥 bibleUpdated signal received.");
    loadVerse();
  }
  if (event.key === "bibleStyle" || event.key === "bibleStyleUpdated") {
    console.log("🎨 Style update signal received.");
    applySavedStyle();
  }
});
