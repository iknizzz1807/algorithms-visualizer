import { Bar } from "../types";

export const selectionSort = async (
  array: Bar[],
  updateArray: (array: Bar[]) => void
) => {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (array[j].value < array[minIndex].value) {
        minIndex = j;
      }
    }
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
    updateArray([...array]);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};
