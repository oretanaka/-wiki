let data = { items: [] };

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    render(data.items);
  })
  .catch(err => {
    console.error("JSON読み込み失敗", err);
  });

const input = document.getElementById("search");
const result = document.getElementById("result");

input.addEventListener("input", () => {
  const keyword = input.value.toLowerCase();

  const filtered = data.items.filter(item =>
    item.name.toLowerCase().includes(keyword)
  );

  render(filtered);
});

function render(list) {
  result.innerHTML = "";

  list.forEach(item => {
    result.innerHTML += `
      <div class="item">
        ${item.name} (${item.type})
      </div>
    `;
  });
}
