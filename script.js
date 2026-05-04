const input = document.getElementById("itemSearchBox");
const resultDiv = document.getElementById("itemResult");
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
    "印浮棘": "Sigil of Floating Thorns",
"焔獄魔の紅甲殻": "Infernal Shell",
"焔獄魔の熱鱗": "Infernal Scale",
"常夜の芥": "Tea OF Eternal Night",
"災難の萌芽": "Seedling of Calamity",
"緋散鱗": "Crimson Scale",
"冰刃魔の巌翼": "Sleetsword Wing",
"冰刃魔の浸蝕髄": "Sleetsword Marrow",
"冰刃魔の蒼甲殻": "Sleetsword Shell",
"冰刃魔の冷鱗": "Sleetsword Scale",
"冰刃魔の逆鱗": "Sleetsword Grudge",
"病の種": "Diseased Seedling",
"焔獄魔の逆鱗": "Infernal Grudge",
"弧描角": "Horned Sculpture",
"純白の羽根": "Pure White Plume",
"冥暗の予言": "Gloom Prophecy",
"混色の禍の砕片": "Fused Calamity Debris",
"焔獄魔の巌翼": "Infernal Wing",
"雷霆魔の黄甲殻": "Levinlance Shell",
"切望の牙": "Tusk of Hope",
"碧樹の種子": "Turquoise Timber Seedling",
"焔獄魔の浸蝕髄": "Infernal Marrow",
"焔獄魔の心臓": "Infernal Heart",
"雷霆魔の電鱗": "Levinlance Scale",
"冰刃魔の心臓": "Sleetsword Heart",
"虚ろな墓穴": "Empty Grave",
"逆行薬": "Retrograde Elixir",
"雷霆魔の心臓": "Levinlance Heart",
"雷霆魔の浸蝕髄": "Levinlance Marrow",
"雷霆魔の巌翼": "Levinlance Wing",
"雷霆魔の逆鱗": "Levinlance Grudge",
    "碧之珠": "Cereluean Gem",
    "緋之珠": "Scarlet Gem",
    "翠之珠": "Myrtle Gem",
    "白之珠": "Ivory Gem",
    "黒之珠": "Obsidian Gem",
    "空之珠": "Heavenly Marble",
    "地之珠": "Earthen Marble"
};

// ===============================
// アイテム検索（改良版）
// ===============================
function searchItem() {
    const keyword = input.value.trim();

    if (!keyword) {
        resultDiv.innerText = "入力してください";
        return;
    }

    let results = [];

    for (let key in itemData) {
        if (key.includes(keyword)) {
            results.push(`${key} → ${itemData[key]}`);
        }
    }

    resultDiv.innerText =
        results.length === 0
            ? "見つかりません"
            : results.join("\n");
}
}
window.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("itemSearchBox");
    const resultDiv = document.getElementById("itemResult");

    if (!input || !resultDiv) return;

    const runSearch = () => {
        searchItem();
    };

    // Enterキー
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            runSearch();
        }
    });

    // リアルタイム（軽く制御）
    let timer;
    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(runSearch, 100);
    });
});
