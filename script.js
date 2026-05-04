// ===============================
// レシピデータ
// ===============================
const recipes = [
    {
        name: "無銘改",
        items: [
            { name: "境壊ノ二刀無銘", count: 1 },
            { name: "焔獄魔の逆鱗", count: 30 },
            { name: "焔獄魔の巌翼", count: 20 },
            { name: "冰刃魔の逆鱗", count: 30 },
            { name: "冰刃魔の巌翼", count: 20 },
            { name: "雷霆魔の逆鱗", count: 30 },
            { name: "雷霆魔の巌翼", count: 20 },
            { name: "百足の卵", count: 50 },
            { name: "百足の毒", count: 20 },
            { name: "朱の盤の角", count: 50 },
            { name: "乾いた舌", count: 20 },
            { name: "斬鋭石", count: 50 },
            { name: "剛毅石", count: 50 },
            { name: "霊妙石", count: 50 },
            { name: "穢珠", count: 30 }
        ]
    },
    { name: "無銘", items: [] },
    { name: "真打", items: [] },
    { name: "修羅", items: [] },
    { name: "以蔵武器", items: [] },
    {
        name: "雷爪",
        items: [
            { name: "雷魔の電鱗", count: 2 },
            { name: "雷霆魔の黄甲殻", count: 2 }
        ]
    },
    {
        name: "雷爪耀",
        items: [
            { name: "雷魔の逆鱗", count: 2 },
            { name: "雷霆魔の厳翼", count: 2 }
        ]
    },
    {
        name: "雷爪霹靂",
        items: [
            { name: "雷霆魔の心臓", count: 2 },
            { name: "雷霆魔の浸蝕髄", count: 1 }
        ]
    }
];

// ===============================
// 素材計算
// ===============================
function calculateMaterials() {
    const recipeName = document.getElementById('recipeInput').value.trim();
    const makeCount = parseInt(document.getElementById('countInput').value) || 1;
    const outputDiv = document.getElementById('output');

    const target = recipes.find(r => r.name === recipeName);

    if (!target) {
        outputDiv.innerText = `【エラー】\nそのレシピ（${recipeName}）は存在しません。`;
        outputDiv.style.color = "#ff6b6b";
        return;
    }

    outputDiv.style.color = "#ffffff";

    let result = `\n【必要素材（${makeCount}本分）】\n`;

    if (!target.items || target.items.length === 0) {
        result += "素材情報が登録されていません。";
    } else {
        target.items.forEach(m => {
            const total = m.count * makeCount;
            result += ` - ${m.name} × ${total.toLocaleString()}\n`;
        });
    }

    outputDiv.innerText = result;
}

// ===============================
// アイテムデータ
// ===============================
const itemData = {
    "item_001": "白",
    "item_002": "黒",
    "item_003": "赤"
};

// ===============================
// アイテム検索
// ===============================
function searchItem() {
    const id = document.getElementById("itemSearchBox").value.trim();
    const result = itemData[id] || "見つかりません";
    document.getElementById("itemResult").innerText = result;
}
