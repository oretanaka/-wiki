// ===============================
// モンスターデータ
// ===============================
const monsterData = {
    "鬱だるま": {
        name: "鬱だるま(大)",
        kana: "うつだるま",
        drops: [
            { item: "鬱だるまの欠片", price: 8 },
            { item: "和紙", price: 213 },
            { item: "だるまウヰスキー", price: 280 }
        ],
        locations: ["奇怪ヶ原", "鬼ヶ島修験場", "叫喚洞"],
        notes: "外道丸のアジトでは痛だるまと表示",
        weakness: ["炎"],
        resistance: ["飛", "闇"]
    },

    "痛だるま": {
        name: "痛だるま(大)",
        kana: "いただるま",
        drops: [
            { item: "痛だるまの欠片", price: 1 },
            { item: "干し鮑", price: 50 },
            { item: "だるまウヰスキー", price: 280 }
        ],
        locations: ["阿傍の森", "黒縄森林"],
        weakness: ["氷"],
        resistance: ["飛", "闇"]
    }
};

// ===============================
// 逆引き
// ===============================
const itemToMonster = {};

function buildIndex() {
    for (const monsterName in monsterData) {
        const monster = monsterData[monsterName];

        monster.drops.forEach(d => {
            if (!itemToMonster[d.item]) {
                itemToMonster[d.item] = [];
            }
            itemToMonster[d.item].push(monsterName);
        });
    }
}

// ===============================
// 初期化（確実に実行）
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    buildIndex();
    console.log("✔ Wiki初期化完了");
});

// ===============================
// 検索
// ===============================
function search() {
    const input = document.getElementById("searchBox");
    const output = document.getElementById("output");

    if (!input || !output) {
        console.log("❌ DOM取得失敗");
        return;
    }

    const keyword = input.value.trim();
    if (!keyword) return;

    console.log("🔍 検索:", keyword);

    let result = [];

    // =========================
    // モンスター検索
    // =========================
    for (const mName in monsterData) {
        const m = monsterData[mName];

        if (
            mName.includes(keyword) ||
            m.name.includes(keyword) ||
            m.kana.includes(keyword)
        ) {
            result.push(`=== モンスター: ${m.name} ===`);
            result.push(`読み: ${m.kana}`);

            result.push("\n▼ ドロップ");
            m.drops.forEach(d => {
                result.push(`- ${d.item} (価値:${d.price})`);
            });

            result.push("\n▼ 出現場所");
            result.push(m.locations.join(", "));

            result.push("\n▼ 弱点");
            result.push(m.weakness.join(", "));

            result.push("\n▼ 耐性");
            result.push(m.resistance.join(", "));

            if (m.notes) {
                result.push("\n▼ 備考");
                result.push(m.notes);
            }

            result.push("\n----------------------\n");
        }
    }

    // =========================
    // アイテム逆引き
    // =========================
    for (const item in itemToMonster) {
        if (item.includes(keyword)) {
            result.push(`=== アイテム: ${item} ===`);

            itemToMonster[item].forEach(monsterName => {
                const m = monsterData[monsterName];
                result.push(`- ${m.name}`);
            });

            result.push("\n----------------------\n");
        }
    }

    output.innerText = result.length ? result.join("\n") : "見つかりません";
}
