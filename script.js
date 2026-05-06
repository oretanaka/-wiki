let monsterData = null;
let itemToEnemies = {}; // アイテム名 → 敵一覧の逆引き辞書

// 初期ロード（キャッシュ完全破壊）
fetch("data.json?v=" + Date.now())
  .then(r => r.json())
  .then(data => {
    monsterData = data;
    buildReverseIndex();
  });

// 逆引き辞書を作成
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

// 検索処理
function search() {
  const query = document.getElementById("search").value.trim();
  const resultBox = document.getElementById("result");

  if (!query) {
    resultBox.innerHTML = "入力してください。";
    return;
  }

  // 敵名で検索
  const enemy = getEnemyByName(query);
  if (enemy) {
    resultBox.innerHTML = `
      <h2>${query}</h2>
      <p><b>出現場所:</b> ${enemy.locations.join(", ")}</p>
      <p><b>ドロップ:</b></p>
      <ul>${enemy.drops.map(d => `<li>${d.item} (${d.price})</li>`).join("")}</ul>
    `;
    addTranslateButtons(); // ★追加
    return;
  }

  // アイテム名で検索
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
    addTranslateButtons(); // ★追加
    return;
  }

  resultBox.innerHTML = "該当なし。";
  addTranslateButtons(); // ★追加
}

/* -------------------------
   ★ここから翻訳機能追加
-------------------------- */

// 日本語 → 英語辞書
const jpToEn = {
  "出現場所": "Locations",
  "ドロップ": "Drops",
  "このアイテムを落とす敵": "Enemies that drop this item",
  "該当なし。": "No results.",
  "入力してください。": "Please enter a keyword.",
};

// 英語 → 日本語辞書（自動生成）
const enToJp = Object.fromEntries(
  Object.entries(jpToEn).map(([jp, en]) => [en, jp])
);

// HTML 内テキストを翻訳
function translateHTML(html, toEnglish = true) {
  const dict = toEnglish ? jpToEn : enToJp;
  let result = html;

  for (const key in dict) {
    const value = dict[key];
    result = result.replaceAll(key, value);
  }

  return result;
}

// 翻訳ボタンを追加
function addTranslateButtons() {
  const resultBox = document.getElementById("result");

  const btns = `
    <div style="margin-top:10px;">
      <button onclick="translateResult(true)">英語で表示</button>
      <button onclick="translateResult(false)">日本語で表示</button>
    </div>
  `;

  resultBox.innerHTML += btns;
}

// 翻訳実行
function translateResult(toEnglish) {
  const resultBox = document.getElementById("result");
  resultBox.innerHTML = translateHTML(resultBox.innerHTML, toEnglish);
  addTranslateButtons(); // ボタンを再追加
}
