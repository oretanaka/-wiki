let monsterData = null;
let magatamaData = null;
let itemToEnemies = {};
let magatamaAlias = {}; // 日本語名・英語スペース → 英語キー

/* ===============================
   初期ロード
   =============================== */
Promise.all([
  fetch("data.json?v=" + Date.now()).then(r => r.json()),
  fetch("magatama_drops_full_619.json?v=" + Date.now()).then(r => r.json())
]).then(async ([monster, magatama]) => {
  monsterData = monster;
  magatamaData = magatama;

  buildReverseIndex();
  await buildMagatamaAlias(); // ★ 日本語名 → 英語キー変換表を作成
});

/* ===============================
   勾玉の日本語名 → 英語キー変換表（完全版）
   =============================== */
async function buildMagatamaAlias() {
  for (const key in magatamaData) {
    const entry = magatamaData[key];

    // 英語スペース → 英語キー
    magatamaAlias[key.replace(/_/g, " ")] = key;

    // 英語キー → 英語キー（小文字対応）
    magatamaAlias[key.toLowerCase()] = key;

    // URL から日本語タイトルを取得
    if (entry.url) {
      try {
        const res = await fetch(entry.url);
        const html = await res.text();

        // <title>久方の勾玉 - Onigiri Wiki</title>
        const match = html.match(/<title>(.*?) - /);
        if (match && match[1]) {
          const jpName = match[1].trim();
          magatamaAlias[jpName] = key;
        }
      } catch (e) {
        console.log("日本語名取得失敗:", key);
      }
    }
  }
}

/* ===============================
   逆引き辞書（アイテム → 敵）
   =============================== */
function buildReverseIndex() {
  for (const enemyName in monsterData) {
    const enemy = monsterData[enemyName];
    if (!enemy.drops) continue;

    enemy.drops.forEach(drop => {
      const item = drop.item;
      if (!itemToEnemies[item]) itemToEnemies[item] = [];
      itemToEnemies[item].push(enemyName);
    });
  }
}

/* ===============================
   データ取得関数
   =============================== */
function getEnemyByName(name) {
  return monsterData[name] || null;
}

function getEnemiesByItem(itemName) {
  return itemToEnemies[itemName] || [];
}

function getLocationsByItem(itemName) {
  const enemies = getEnemiesByItem(itemName);
  const locations = new Set();

  enemies.forEach(enemyName => {
    const enemy = monsterData[enemyName];
    enemy.locations?.forEach(loc => locations.add(loc));
  });

  return [...locations];
}

function getMagatamaByName(name) {
  return magatamaData[name] || null;
}

/* ===============================
   検索処理（完全版）
   =============================== */
function search() {
  let query = document.getElementById("search").value.trim();
  const resultBox = document.getElementById("result");

  if (!query) {
    resultBox.innerHTML = "入力してください。";
    return;
  }

  // 日本語名 → 英語キー
  if (magatamaAlias[query]) {
    query = magatamaAlias[query];
  }

  // 小文字 → 英語キー
  if (magatamaAlias[query.toLowerCase()]) {
    query = magatamaAlias[query.toLowerCase()];
  }

  // 英語スペース → アンダースコア
  if (query.includes(" ")) {
    const underscored = query.replace(/ /g, "_");
    if (magatamaData[underscored]) {
      query = underscored;
    }
  }

  /* ① 勾玉検索 */
  const mag = getMagatamaByName(query);
  if (mag) {
    resultBox.innerHTML = `
      <h2>${query}</h2>
      <p><b>URL:</b> <a href="${mag.url}" target="_blank">${mag.url}</a></p>

      <p><b>入手場所:</b></p>
      ${
        mag.drops.length === 0
          ? "<p>入手場所データがありません。</p>"
          : `<ul>${mag.drops.map(d => `<li>${d}</li>`).join("")}</ul>`
      }
    `;
    return;
  }

  /* ② 敵名検索 */
  const enemy = getEnemyByName(query);
  if (enemy) {
    resultBox.innerHTML = `
      <h2>${query}</h2>
      <p><b>出現場所:</b> ${enemy.locations.join(", ")}</p>
      <p><b>ドロップ:</b></p>
      <ul>${enemy.drops.map(d => `<li>${d.item} (${d.price})</li>`).join("")}</ul>
    `;
    return;
  }

  /* ③ アイテム名検索 */
  const enemies = getEnemiesByItem(query);
  if (enemies.length > 0) {
    const locations = getLocationsByItem(query);

    resultBox.innerHTML = `
      <h2>${query}</h2>
      <p><b>このアイテムを落とす敵:</b></p>
      <ul>${enemies.map(e => `<li>${e}</li>`).join("")}</ul>

      <p><b>出現場所:</b></p>
      <ul>${locations.map(l => `<li>${l}</li>`).join("")}</ul>
    `;
    return;
  }

  resultBox.innerHTML = "該当なし。";
}

/* ===============================
   翻訳機能
   =============================== */
async function translateText() {
  const input = document.getElementById("translateInput").value.trim();
  const output = document.getElementById("translateResult");

  if (!input) {
    output.innerText = "入力してください。";
    return;
  }

  const isJapanese = /[ぁ-んァ-ン一-龯]/.test(input);
  const source = isJapanese ? "ja" : "en";
  const target = isJapanese ? "en" : "ja";

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(input)}`;
    const res = await fetch(url);
    const data = await res.json();

    output.innerText = data[0][0][0] || "翻訳できませんでした。";
  } catch (e) {
    output.innerText = "翻訳エラーが発生しました。";
  }
}

window.search = search;
window.translateText = translateText;
