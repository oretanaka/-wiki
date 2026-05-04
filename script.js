// ===============================
// レシピデータ（完全保持）
// ===============================
const recipes = [
    {
        name: "境懐ノ無銘改",
        weapon: {
            name: "境懐ノ無銘改",
            jpName: "きょうかいのむめいかい",
            requiredLv: 112,
            class: "双剣",
            rarity: 0,
            attack: { min: 8624, max: 9690 },
            durability: { current: 880, max: 880 },
            effects: [
                "難度3以上の双剣スキル威力+40%",
                "装備双剣2本以上で双剣スキル威力+30%",
                "攻撃力+2500",
                "双剣能力+25%",
                "装備双剣2本以上で攻撃力+10%",
                "装備双剣2本以上で双剣能力+15%",
                "斬属性+30",
                "耐久消費+5%",
                "SP自然回復-5",
                "移動速度-8",
                "街属性-40"
            ],
            description:
`静御前の武器解説
平行世界から来た岡田以蔵の双剣を再構築した武器。
刀身と鞘が一体化している特殊構造。`
        },
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
// アイテムデータ（完全保持）
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
    "冰刃魔の逆鱗": "Sleetsword Grudge",
    "焔獄魔の逆鱗": "Infernal Grudge",
    "雷霆魔の逆鱗": "Levinlance Grudge",
    "雷霆魔の巌翼": "Levinlance Wing",
    "碧之珠": "Cereluean Gem",
    "緋之珠": "Scarlet Gem",
    "翠之珠": "Myrtle Gem",
    "白之珠": "Ivory Gem",
    "黒之珠": "Obsidian Gem"
};

// ===============================
// あいまい検索スコア（Wiki用）
// ===============================
function scoreMatch(text, keyword) {
    if (!keyword) return 0;
    if (text === keyword) return 100;
    if (text.includes(keyword)) return 70;
    if (keyword.includes(text)) return 50;
    return 0;
}

// ===============================
// レシピ検索（Wiki強化）
// ===============================
function findRecipe(keyword) {
    keyword = keyword.trim();
    if (!keyword) return null;

    let best = null;
    let bestScore = 0;

    for (const r of recipes) {
        const w = r.weapon;

        const candidates = [
            r.name,
            w?.name,
            w?.jpName,
            w?.class
        ].filter(Boolean);

        for (const c of candidates) {
            const score = scoreMatch(c, keyword);
            if (score > bestScore) {
                best = r;
                bestScore = score;
            }
        }
    }

    return best;
}

// ===============================
// 素材計算
// ===============================
function calculateMaterials() {
    const recipeName = document.getElementById("recipeInput").value.trim();
    const makeCount = parseInt(document.getElementById("countInput").value) || 1;
    const outputDiv = document.getElementById("output");

    const target = findRecipe(recipeName);

    if (!target) {
        outputDiv.innerText = "【エラー】\nレシピが見つかりません";
        outputDiv.style.color = "#ff6b6b";
        return;
    }

    outputDiv.style.color = "#fff";

    let result = `【必要素材（${makeCount}本）】\n`;

    target.items.forEach(m => {
        result += ` - ${m.name} × ${(m.count * makeCount).toLocaleString()}\n`;
    });

    const w = target.weapon;

    result += `\n【武器】\n${w.name}（${w.jpName}）`;
    result += `\nLv${w.requiredLv} / ${w.class}`;
    result += `\nATK ${w.attack.min}~${w.attack.max}`;
    result += `\n耐久 ${w.durability.current}/${w.durability.max}\n`;

    result += `\n【効果】\n${w.effects.join("\n")}`;

    result += `\n\n【解説】\n${w.description}`;

    outputDiv.innerText = result;
}

// ===============================
// アイテム検索（カテゴリ＋ハイライト）
// ===============================
function searchItem() {
    const input = document.getElementById("itemSearchBox");
    const resultDiv = document.getElementById("itemResult");

    const keyword = input.value.trim();

    if (!keyword) {
        resultDiv.innerText = "";
        return;
    }

    const results = [];

    for (const key in itemData) {
        const value = itemData[key];

        if (key.includes(keyword) || value.includes(keyword)) {
            results.push(`[素材] ${highlight(key, keyword)} → ${value}`);
        }
    }

    resultDiv.innerHTML =
        results.length ? results.join("<br>") : "見つかりません";
}

// ===============================
// ハイライト
// ===============================
function highlight(text, keyword) {
    return text.replace(
        new RegExp(keyword, "g"),
        `<span style="color:#00ff99">${keyword}</span>`
    );
}

// ===============================
// イベント（完全安定版）
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    const recipeInput = document.getElementById("recipeInput");
    const itemInput = document.getElementById("itemSearchBox");

    // レシピEnter
    recipeInput.addEventListener("keydown", e => {
        if (e.key === "Enter") calculateMaterials();
    });

    // アイテムEnter
    itemInput.addEventListener("keydown", e => {
        if (e.key === "Enter") searchItem();
    });

    // ❌リアルタイム検索は廃止（暴発防止）
});
