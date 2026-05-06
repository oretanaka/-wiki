let monsterData = null;
let itemToEnemies = {}; // アイテム名 → 敵一覧の逆引き辞書

// 意味翻訳辞書（優先）
const itemMeaningDict = {
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

// 自動生成されるアイテム翻訳辞書
let itemJpToEn = {};

// ひらがな → ローマ字
function kanaToRomaji(kana) {
  const table = {
    きゃ:"kya", きゅ:"kyu", きょ:"kyo",
    しゃ:"sha", しゅ:"shu", しょ:"sho",
    ちゃ:"cha", ちゅ:"chu", ちょ:"cho",
    にゃ:"nya", にゅ:"nyu", にょ:"nyo",
    あ:"a", い:"i", う:"u", え:"e", お:"o",
    か:"ka", き:"ki", く:"ku", け:"ke", こ:"ko",
    さ:"sa", し:"shi", す:"su", せ:"se", そ:"so",
    た:"ta", ち:"chi", つ:"tsu", て:"te", と:"to",
    な:"na", に:"ni", ぬ:"nu", ね:"ne", の:"no",
    は:"ha", ひ:"hi", ふ:"fu", へ:"he", ほ:"ho",
    ま:"ma", み:"mi", む:"mu", め:"me", も:"mo",
    や:"ya", ゆ:"yu", よ:"yo",
    ら:"ra", り:"ri", る:"ru", れ:"re", ろ:"ro",
    わ:"wa", を:"wo", ん:"n"
  };

  let result = kana;
  for (const k in table) result = result.replaceAll(k, table[k]);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// カタカナ → ローマ字
function kataToRomaji(text) {
  return text
    .replace(/[ァ-ン]/g, c => kanaToRomaji(c.toLowerCase()))
    .replace(/[^a-zA-Z]/g, "");
}

// data.json 読み込み
fetch("data.json?v=" + Date.now())
  .then(r => r.json())
  .then(data => {
    monsterData = data;
    buildReverseIndex();
    buildItemTranslationDict(); // ★自動生成
  });

// 逆引き辞書
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

// ★ data.json のアイテム名をすべて翻訳辞書に登録
function buildItemTranslationDict() {
  for (const enemyName in monsterData) {
    const enemy = monsterData[enemyName];
    if (!enemy.drops) continue;

    enemy.drops.forEach(drop => {
      const item = drop.item;

      // すでに登録済みならスキップ
      if (itemJpToEn[item]) return;

      // 意味翻訳辞書にある場合はそれを使う
      if (itemMeaningDict[item]) {
        itemJpToEn[item] = itemMeaningDict[item];
        return;
      }

      // カタカナ → ローマ字
      if (/^[ァ-ン]+$/.test(item)) {
        itemJpToEn[item] = kataToRomaji(item);
        return;
      }

      // ひらがな → ローマ字
      if (/^[ぁ-ん]+$/.test(item)) {
        itemJpToEn[item] = kanaToRomaji(item);
        return;
      }

      // その他はそのまま
      itemJpToEn[item] = item;
    });
  }
}

// HTML 内のアイテム名だけ英語に置換
function translateItems(html) {
  let result = html;
  for (const jp in itemJpToEn) {
    result = result.replaceAll(jp, itemJpToEn[jp]);
  }
  return result;
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

// 検索処理（元コードそのまま）
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

    html = translateItems(html); // ★アイテム名だけ翻訳

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

    html = translateItems(html); // ★アイテム名だけ翻訳

    resultBox.innerHTML = html;
    return;
  }

  resultBox.innerHTML = "該当なし。";
}
