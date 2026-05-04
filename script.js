// アイテムデータ
const itemData = {
    "item_001": "白",
    "item_002": "黒",
    "item_003": "赤"
};

// 検索処理
function searchItem() {
    const id = document.getElementById("itemSearchBox").value;
    const result = itemData[id] || "見つかりません";
    document.getElementById("itemResult").innerText = result;
}
