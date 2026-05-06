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
   ★ 翻訳機能（完成版）
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

// テキストノードだけ翻訳（HTML構造は壊さない）
function translateNodeText(node, dict) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent;
    for (const key in dict) {
      text = text.replaceAll(key, dict[key]);
    }
    node.textContent = text;
  } else {
    node.childNodes.forEach(child => translateNodeText(child, dict));
  }
}

// 翻訳実行（ボタン部分を除外）
function translateResult(toEnglish) {
  const dict = toEnglish ? jpToEn : enToJp;
  const resultBox = document.getElementById("result");

  // ボタン部分を退避
  const btns = document.getElementById("translate-buttons");
  let btnHTML = "";
  if (btns) {
    btnHTML = btns.outerHTML;
    btns.remove();
  }

  // ボタン以外を翻訳
  translateNodeText(resultBox, dict);

  // ボタンを戻す（増殖しない）
  resultBox.insertAdjacentHTML("beforeend", btnHTML);
}

// 翻訳ボタン（増殖防止）
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
