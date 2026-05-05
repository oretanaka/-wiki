// サンプルレシピ（ここ拡張してOK）
const recipes = {
    "無銘改": {
        materials: [
            { name: "鉄鉱石", count: 10 },
            { name: "魔石", count: 3 }
        ]
    }
};

// アイテム辞書（例）
const itemData = {
    "iron": "鉄鉱石",
    "鉄鉱石": "iron ore",
    "magic stone": "魔石",
    "魔石": "magic stone"
};

// =======================
// レシピ計算
// =======================
function calculateMaterials() {
    const name = document.getElementById("recipeInput").value.trim();
    const count = parseInt(document.getElementById("countInput").value);

    const output = document.getElementById("output");

    if (!name) {
        output.textContent = "レシピ名を入力してください";
        return;
    }

    if (!recipes[name]) {
        output.textContent = "レシピが見つかりません: " + name;
        return;
    }

    if (!count || count <= 0) {
        output.textContent = "作成数が不正です";
        return;
    }

    let result = `【${name}】 × ${count}\n\n必要素材:\n`;

    recipes[name].materials.forEach(m => {
        result += `- ${m.name}: ${m.count * count}\n`;
    });

    output.textContent = result;
}

// =======================
// アイテム検索
// =======================
function searchItem() {
    const query = document.getElementById("itemSearchBox").value.trim();
    const result = document.getElementById("itemResult");

    if (!query) {
        result.textContent = "検索ワードを入力してください";
        return;
    }

    const lower = query.toLowerCase();

    let found = null;

    for (const key in itemData) {
        if (
            key.toLowerCase().includes(lower) ||
            itemData[key].toLowerCase().includes(lower)
        ) {
            found = key + " → " + itemData[key];
            break;
        }
    }

    result.textContent = found || "見つかりませんでした";
}
