
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
