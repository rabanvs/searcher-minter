var cats = require("../../data/abi/cats.json");

var cats_filtered = Object.entries(cats).filter((cat) => {
  return cat[1].rating < 100;
});

var cats_sorted = cats_filtered.sort(function (a, b) {
  return a[1].rating - b[1].rating;
});

for (cat in cats_sorted) {
  console.log(cats_sorted[cat][0]);
}

cats_sorted.map();
