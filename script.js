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
        const val = itemData[key];

        if (key.includes(keyword) || val.includes(keyword)) {
            results.push(`[素材] ${key} → ${val}`);
        }
    }

    resultDiv.innerText =
        results.length ? results.join("\n") : "見つかりません";
}
});
