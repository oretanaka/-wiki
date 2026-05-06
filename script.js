let monsterData = null;
let itemToEnemies = {}; // アイテム名 → 敵一覧の逆引き辞書

// 敵名・アイテム名の翻訳辞書
let enemyNameDict = {};
let itemNameDict = {};

// 初期ロード（キャッシュ完全破壊）
fetch("data.json?v=" + Date.now())
  .then(r => r.json())
  .then(data => {
    monsterData = data;
    buildReverseIndex();
    buildNameDictionaries(); // ★追加：翻訳辞書生成
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

// ★ 敵名・アイテム名の翻訳辞書を自動生成
function buildNameDictionaries() {
  for (const enemyName in monsterData) {
    const enemy = monsterData[enemyName];

    // 敵名 → 英語（kana があればローマ字化）
    const enName = enemy.kana ? enemy.kana : enemyName;
    enemyNameDict[enemyName] = enName;

    // アイテム名 → 英語（簡易翻訳 or ローマ字）
    if (enemy.drops) {
      enemy.drops.forEach(drop => {
        const item = drop.item;
        itemNameDict[item] = item; // とりあえずローマ字化なし
      });
    }
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
   ★ 翻訳機能（敵名・アイテム名対応）
-------------------------- */

// UI 固定文の辞書
const jpToEn = {
  "出現場所": "Locations",
  "ドロップ": "Drops",
  "このアイテムを落とす敵": "Enemies that drop this item",
  "該当なし。": "No results.",
  "入力してください。": "Please enter a keyword.",
};

const enToJp = Object.fromEntries(
  Object.entries(jpToEn).map(([jp, en]) => [en, jp])
);

// テキストノード翻訳（敵名・アイテム名も含む）
function translateNodeText(node, dict) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent;

    // UI 固定文
    for (const key in dict) {
      text = text.replaceAll(key, dict[key]);
    }

    // 敵名
    for (const jp in enemyNameDict) {
      const en = enemyNameDict[jp];
      text = text.replaceAll(jp, en);
    }

    // アイテム名
    for (const jp in itemNameDict) {
      const en = itemNameDict[jp];
      text = text.replaceAll(jp, en);
    }

    node.textContent = text;
  } else {
    node.childNodes.forEach(child => translateNodeText(child, dict));
  }
}

// 翻訳実行（ボタン除外）
function translateResult(toEnglish) {
  const dict = toEnglish ? jpToEn : enToJp;
  const resultBox = document.getElementById("result");

  const btns = document.getElementById("translate-buttons");
  let btnHTML = "";
  if (btns) {
    btnHTML = btns.outerHTML;
    btns.remove();
  }

  translateNodeText(resultBox, dict);

  resultBox.insertAdjacentHTML("beforeend", btnHTML);
}

// 翻訳ボタン
function addTranslateButtons() {
  const resultBox = document.getElementById("result");

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
