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

/* -------------------------
   ★ 敵名・アイテム名の翻訳辞書生成
-------------------------- */

// ひらがな → ローマ字（簡易）
function kanaToRomaji(kana) {
  const table = {
    きゃ:"kya", きゅ:"kyu", きょ:"kyo",
    しゃ:"sha", しゅ:"shu", しょ:"sho",
    ちゃ:"cha", ちゅ:"chu", ちょ:"cho",
    にゃ:"nya", にゅ:"nyu", にょ:"nyo",
    ひゃ:"hya", ひゅ:"hyu", ひょ:"hyo",
    みゃ:"mya", みゅ:"myu", みょ:"myo",
    りゃ:"rya", りゅ:"ryu", りょ:"ryo",
    ぎゃ:"gya", ぎゅ:"gyu", ぎょ:"gyo",
    じゃ:"ja", じゅ:"ju", じょ:"jo",
    びゃ:"bya", びゅ:"byu", びょ:"byo",
    ぴゃ:"pya", ぴゅ:"pyu", ぴょ:"pyo",
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
  for (const k in table) {
    result = result.replaceAll(k, table[k]);
  }
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// アイテム意味翻訳辞書（必要に応じて追加）
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

// 敵名・アイテム名辞書生成
function buildNameDictionaries() {
  for (const enemyName in monsterData) {
    const enemy = monsterData[enemyName];

    // 敵名 → 英語（kana → ローマ字）
    if (enemy.kana) {
      enemyNameDict[enemyName] = kanaToRomaji(enemy.kana);
    } else {
      enemyNameDict[enemyName] = enemyName;
    }

    // アイテム名 → 英語（意味翻訳 or fallback）
    if (enemy.drops) {
      enemy.drops.forEach(drop => {
        const item = drop.item;

        if (itemMeaningDict[item]) {
          itemNameDict[item] = itemMeaningDict[item];
        } else {
          itemNameDict[item] = item; // fallback
        }
      });
    }
  }
}

/* -------------------------
   ★ 既存の検索処理（変更なし）
-------------------------- */

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

function search() {
  const query = document.getElementById("search").value.trim();
  const resultBox = document.getElementById("result");

  if (!query) {
    resultBox.innerHTML = "入力してください。";
    addTranslateButtons();
    return;
  }

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
   ★ 翻訳機能（完全版）
-------------------------- */

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
      text = text.replaceAll(jp, enemyNameDict[jp]);
    }

    // アイテム名
    for (const jp in itemNameDict) {
      text = text.replaceAll(jp, itemNameDict[jp]);
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
