import { shareAsync } from "expo-sharing";

export function DeleteItem(title, dataArr) {
  console.log("Called DeleteItem function");
  return dataArr.filter((r) => r.title !== title);
}

export function getCurrentISOString() {
  const date = new Date();
  return date.toISOString();
}

export async function shareFile(uri: string) {
  try {
    await shareAsync(uri);

    console.log("File copied successfully");
  } catch (e) {
    console.log("Error occured while sharing", e);
  }
}
