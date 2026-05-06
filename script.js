let monsterData = null;
let itemToEnemies = {}; // アイテム名 → 敵一覧の逆引き辞書

// ★追加：アイテム翻訳辞書（必要に応じて増やせる）
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
  "和紙": "Washi",
  "だるまウヱスキー": "Daruma Whisky",
  // 必要に応じて追加
};

// ★追加：HTML 内のアイテム名だけ英語に置換
function translateItems(html) {
  let result = html;
  for (const jp in itemJpToEn) {
    result = result.replaceAll(jp, itemJpToEn[jp]);
  }
  return result;
}

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
    let html = `
      <h2>${query}</h2>
      <p><b>出現場所:</b> ${enemy.locations.join(", ")}</p>
      <p><b>ドロップ:</b></p>
      <ul>${enemy.drops.map(d => `<li>${d.item} (${d.price})</li>`).join("")}</ul>
    `;

    // ★追加：アイテム名だけ翻訳
    html = translateItems(html);

    resultBox.innerHTML = html;
    return;
  }

  // アイテム名で検索
  const enemies = getEnemiesByItem(query);
  if (enemies.length > 0) {
    const locations = getLocationsByItem(query);

    let html = `
      <h2>${query}</h2>
      <p><b>このアイテムを落とす敵:</b></p>
      <ul>${enemies.map(e => `<li>${e}</li>`).join("")}</ul>

      <p><b>出現場所:</b></p>
      <ul>${locations.map(l => `<li>${l}</li>`).join("")}</ul>
    `;

    // ★追加：アイテム名だけ翻訳
    html = translateItems(html);

    resultBox.innerHTML = html;
    return;
  }

  resultBox.innerHTML = "該当なし。";
}
