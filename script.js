// ===============================
// レシピデータ
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
「平行世界からやってきた岡田以蔵という男性が使っていた双剣
を、晴明さんがバナ鳥さんさん向けに再構築したものだね。なん
と、十兵衛さんが持っている「兼氏」の元来の会なんだって!十
兵衛さんの兼氏は刀身と鞘が分かれて鞘が自立稼働するけど、こ
っちは刀身と鞘が一体になってるみたい。形を見るに、兼氏の本
体は元々鞘の方なのかも。核となる部分に色が付いて、芯が通っ
た感じがするね!」
`
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
// 素材計算（そのまま維持）
// ===============================
function calculateMaterials() {
    const recipeName = document.getElementById("recipeInput").value.trim();
    const makeCount = parseInt(document.getElementById("countInput").value) || 1;
    const outputDiv = document.getElementById("output");

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
// 検索（拡張のみ・破壊なし）
// ===============================
function searchItem(input, resultDiv) {
    const keyword = input.value.trim();

    if (!keyword) {
        resultDiv.innerText = "入力してください";
        return;
    }

    const results = [];

    // ===== アイテム検索 =====
    for (const key in itemData) {
        const value = itemData[key];

        if (key.includes(keyword) || value.includes(keyword)) {
            results.push(`[素材] ${key} → ${value}`);
        }
    }

    // ===== 武器検索（追加・既存非破壊）=====
    for (const r of recipes) {
        if (!r.weapon) continue;

        const w = r.weapon;

        if (
            r.name.includes(keyword) ||
            w.name.includes(keyword) ||
            w.jpName.includes(keyword) ||
            w.class.includes(keyword)
        ) {
            results.push(
`[武器] ${w.name}
JP:${w.jpName}
LV:${w.requiredLv} / ${w.class}
ATK:${w.attack.min}~${w.attack.max}
耐久:${w.durability.current}/${w.durability.max}
効果:${w.effects.slice(0, 3).join(" / ")}...`
            );
        }
    }

    resultDiv.innerText =
        results.length ? results.join("\n\n") : "見つかりません";
}

// ===============================
// イベント（そのまま維持）
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("itemSearchBox");
    const resultDiv = document.getElementById("itemResult");

    if (!input || !resultDiv) return;

    const runSearch = () => searchItem(input, resultDiv);

    let timer = null;

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") runSearch();
    });

    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(runSearch, 80);
    });
});
