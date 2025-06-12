import { Bar } from "../types";

export const bubbleSort = async (
  array: Bar[],
  updateArray: (array: Bar[]) => void
) => {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j].value > array[j + 1].value) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateArray([...array]);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  }
};
