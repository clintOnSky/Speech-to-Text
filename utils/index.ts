export function DeleteItem(title, dataArr) {
  console.log("Called DeleteItem function");
  return dataArr.filter((r) => r.title !== title);
}

export function getCurrentISOString() {
  const date = new Date();
  return date.toISOString();
}
