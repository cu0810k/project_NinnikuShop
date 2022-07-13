export function currency (num) {
  const n = parseInt(num, 10)
  return `NT$ ${n.toFixed(0).replace(/./g, (c, i, a) => (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c))}`
}

// export function currency (num) {
//   const formatter = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'JPY', // 此處爲各貨幣的縮寫，如JPY,CAD,EUR,GBP等，都能展示對應的貨幣顯示
//     minimumFractionDigits: 2
//   })
//   return formatter.format(num)
// }
