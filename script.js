let data = { items: [], monsters: [] };

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    console.log("loaded");
  });

const searchInput = document.getElementById("search");
const result = document.getElementById("result");

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  result.innerHTML = "";

  if (!data.items) return;
  if (!keyword) return;

  const items = data.items.filter(i =>
    i.name.toLowerCase().includes(keyword)
  );

  const monsters = data.monsters.filter(m =>
    m.name.toLowerCase().includes(keyword)
  );

  result.innerHTML += items.map(i => `
    <div class="card">
      アイテム: ${i.name}
    </div>
  `).join("");

  result.innerHTML += monsters.map(m => `
    <div class="card">
      モンスター: ${m.name}
    </div>
  `).join("");
});
