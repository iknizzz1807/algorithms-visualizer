import { Bar } from "../types";

const partition = async (
  array: Bar[],
  low: number,
  high: number,
  updateArray: (array: Bar[]) => void
) => {
  const pivot = array[high].value;
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (array[j].value < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      updateArray([...array]);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  updateArray([...array]);
  await new Promise((resolve) => setTimeout(resolve, 50));
  return i + 1;
};

export const quickSort = async (
  array: Bar[],
  low: number,
  high: number,
  updateArray: (array: Bar[]) => void
) => {
  if (low < high) {
    const pi = await partition(array, low, high, updateArray);
    await quickSort(array, low, pi - 1, updateArray);
    await quickSort(array, pi + 1, high, updateArray);
  }
};
