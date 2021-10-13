var bears = require("./foxes.json");

const relevant_bears = bears.nfts.slice(0, 100);

const listed_bears = relevant_bears.filter((bear) => {
  return bear.opensea_price > 0;
});

const relevant_data = listed_bears.map((b) => {
  return { id: b.token_id, rank: b.rarity_rank, price: b.opensea_price };
});

// console.log(relevant_data);
const sorted_bears = relevant_data.sort(function (a, b) {
  return b.price - a.price;
});
console.log(sorted_bears);

// const rele

// var cats_filtered = Object.entries(cats).filter((cat) => {
//   return cat[1].rating < 100;
// });

// var cats_sorted = cats_filtered.sort(function (a, b) {
//   return a[1].rating - b[1].rating;
// });

// for (cat in cats_sorted) {
//   console.log(cats_sorted[cat][0]);
// }

// cats_sorted.map();
