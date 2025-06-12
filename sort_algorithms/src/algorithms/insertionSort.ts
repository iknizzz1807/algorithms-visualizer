import { Bar } from "../types";

export const insertionSort = async (
  array: Bar[],
  updateArray: (array: Bar[]) => void
) => {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j].value > key.value) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;
    updateArray([...array]);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};
