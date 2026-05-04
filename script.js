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
// 検索関数
// ===============================
function searchItem() {
    const input = document.getElementById("itemSearchBox");
    const resultDiv = document.getElementById("itemResult");

    const keyword = input.value.trim();

    if (!keyword) {
        resultDiv.innerText = "入力してください";
        return;
    }

    const results = [];

    for (let key in itemData) {
        if (
            key.includes(keyword) ||
            itemData[key].includes(keyword) // 英語検索対応
        ) {
            results.push(`${key} → ${itemData[key]}`);
        }
    }

    resultDiv.innerText =
        results.length === 0 ? "見つかりません" : results.join("\n");
}

// ===============================
// イベント設定（ここが正解の場所）
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("itemSearchBox");
    const resultDiv = document.getElementById("itemResult");

    if (!input || !resultDiv) return;

    let timer;

    // Enterキー検索
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            searchItem();
        }
    });

    // リアルタイム検索（軽量化付き）
    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(searchItem, 100);
    });
});
