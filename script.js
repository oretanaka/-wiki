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
    addTranslateButtons();
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
    addTranslateButtons();
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
    addTranslateButtons();
    return;
  }

  resultBox.innerHTML = "該当なし。";
  addTranslateButtons();
}

/* -------------------------
   ★ 翻訳用マップ
-------------------------- */

// UI 固定文
const uiJpToEn = {
  "出現場所": "Locations",
  "ドロップ": "Drops",
  "このアイテムを落とす敵": "Enemies that drop this item",
  "該当なし。": "No results.",
  "入力してください。": "Please enter a keyword.",
};

// 敵名（必要に応じて増やしていける）
const enemyJpToEn = {
  "テュポーン": "Typhon",
  // ここに増やしていく: "鬱だるま": "Utsudaruma", など
};

// アイテム名（必要に応じて増やしていける）
const itemJpToEn = {
  "触手": "Tentacle",
  "無常の果実": "Fruit of Impermanence",
  "堕天の翼": "Fallen Wing",
  "震える風": "Shivering Wind",
  "血錆の鍵": "Bloodrust Key",
  "晦冥の氷華": "Dark Ice Blossom",
  "万魔殿の混沌": "Pandemonium Chaos",
  "叛逆の炎": "Flame of Rebellion",
  "憤怒の魔導書": "Grimoire of Wrath",
};

// 逆引き（英→日）を自動生成
const uiEnToJp = Object.fromEntries(
  Object.entries(uiJpToEn).map(([jp, en]) => [en, jp])
);
const enemyEnToJp = Object.fromEntries(
  Object.entries(enemyJpToEn).map(([jp, en]) => [en, jp])
);
const itemEnToJp = Object.fromEntries(
  Object.entries(itemJpToEn).map(([jp, en]) => [en, jp])
);

/* -------------------------
   ★ HTML 文字列ベース翻訳
-------------------------- */

function translateHtmlString(html, toEnglish) {
  let result = html;

  if (toEnglish) {
    // UI
    for (const jp in uiJpToEn) {
      result = result.replaceAll(jp, uiJpToEn[jp]);
    }
    // 敵
    for (const jp in enemyJpToEn) {
      result = result.replaceAll(jp, enemyJpToEn[jp]);
    }
    // アイテム
    for (const jp in itemJpToEn) {
      result = result.replaceAll(jp, itemJpToEn[jp]);
    }
  } else {
    // UI
    for (const en in uiEnToJp) {
      result = result.replaceAll(en, uiEnToJp[en]);
    }
    // 敵
    for (const en in enemyEnToJp) {
      result = result.replaceAll(en, enemyEnToJp[en]);
    }
    // アイテム
    for (const en in itemEnToJp) {
      result = result.replaceAll(en, itemEnToJp[en]);
    }
  }

  return result;
}

/* -------------------------
   ★ 翻訳ボタンと実行
-------------------------- */

function translateResult(toEnglish) {
  const resultBox = document.getElementById("result");

  // 既存ボタンを退避して削除
  const btns = document.getElementById("translate-buttons");
  let btnHTML = "";
  if (btns) {
    btnHTML = btns.outerHTML;
    btns.remove();
  }

  // 本文を翻訳
  const translated = translateHtmlString(resultBox.innerHTML, toEnglish);
  resultBox.innerHTML = translated;

  // ボタンを戻す（1セットだけ）
  if (btnHTML) {
    resultBox.insertAdjacentHTML("beforeend", btnHTML);
  } else {
    addTranslateButtons();
  }
}

function addTranslateButtons() {
  const resultBox = document.getElementById("result");

  // 既存ボタン削除
  const old = document.getElementById("translate-buttons");
  if (old) old.remove();

  const btns = document.createElement("div");
  btns.id = "translate-buttons";
  btns.style.marginTop = "10px";

  btns.innerHTML = `
    <button onclick="translateResult(true)">英語で表示</button>
    <button onclick="translateResult(false)">日本語で表示</button>
  `;

  resultBox.appendChild(btns);
}
