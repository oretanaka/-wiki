let monsterData = null;
let magatamaData = null;   // ← 勾玉データ追加
let itemToEnemies = {};    // アイテム名 → 敵一覧の逆引き辞書

/* ===============================
   初期ロード（キャッシュ破壊）
   =============================== */
Promise.all([
  fetch("data.json?v=" + Date.now()).then(r => r.json()),
  fetch("magatama.json?v=" + Date.now()).then(r => r.json())  // ← 勾玉読み込み
]).then(([monster, magatama]) => {
  monsterData = monster;
  magatamaData = magatama;
  buildReverseIndex();
});

/* ===============================
   逆引き辞書を作成
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

// 敵名 → 敵データ
function getEnemyByName(name) {
  return monsterData[name] || null;
}

// アイテム名 → そのアイテムを落とす敵一覧
function getEnemiesByItem(itemName) {
  return itemToEnemies[itemName] || [];
}

// アイテム名 → ダンジョン一覧
function getLocationsByItem(itemName) {
  const enemies = getEnemiesByItem(itemName);
  const locations = new Set();

  enemies.forEach(enemyName => {
    const enemy = monsterData[enemyName];
    enemy.locations?.forEach(loc => locations.add(loc));
  });

  return [...locations];
}

// 勾玉名 → 勾玉データ（新機能）
function getMagatamaByName(name) {
  return magatamaData[name] || null;
}

/* ===============================
   検索処理
   =============================== */
function search() {
  const query = document.getElementById("search").value.trim();
  const resultBox = document.getElementById("result");

  if (!query) {
    resultBox.innerHTML = "入力してください。";
    return;
  }

  /* ① 勾玉名で検索（新機能） */
  const mag = getMagatamaByName(query);
  if (mag) {
    resultBox.innerHTML = `
      <h2>${query}</h2>
      <p><b>レア度:</b> ${mag.rarity || "不明"}</p>
      <p><b>説明:</b> ${mag.description || "なし"}</p>

      <p><b>Drops from:</b></p>
      <ul>${mag.dropsFrom.map(e => `<li>${e}</li>`).join("")}</ul>
    `;
    return;
  }

  /* ② 敵名で検索 */
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

  /* ③ アイテム名で検索 */
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
   翻訳機能（Google Translate）
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

/* ===============================
   グローバル公開
   =============================== */
window.search = search;
window.translateText = translateText;
