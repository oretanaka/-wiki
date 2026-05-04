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
    }
];

// ===============================
// アイテムデータ
// ===============================
const itemData = {
    "印浮棘": "Sigil of Floating Thorns",
    "焔獄魔の紅甲殻": "Infernal Shell",
    "焔獄魔の熱鱗": "Infernal Scale",
    "常夜の芥": "Tea OF Eternal Night",
    "災難の萌芽": "Seedling of Calamity"
};

// ===============================
// 検索（関数だけ単独でOK）
// ===============================
function searchItem(input, resultDiv) {
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

// ===============================
// イベント設定
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("itemSearchBox");
    const resultDiv = document.getElementById("itemResult");

    if (!input || !resultDiv) return;

    const runSearch = () => searchItem(input, resultDiv);

    // Enter
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") runSearch();
    });

    // リアルタイム（軽量化）
    let timer;
    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(runSearch, 100);
    });
});
