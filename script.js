fetch("data.json")
  .then(res => {
    if (!res.ok) {
      throw new Error("data.json 読み込み失敗");
    }
    return res.json();
  })
  .then(json => {
    data = json;
    console.log("OK:", data);
  })
  .catch(err => {
    console.error("エラー:", err);
  });
