const canvas = document.getElementById("container") as HTMLCanvasElement;

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

// Có thể thay đổi tuỳ theo yêu cầu của người dùng
let rulerWidth = 1000;
let rulerHeight = 100;
let isAnimating = true;

let START_X = CANVAS_WIDTH / 2 - rulerWidth / 2;
let START_Y = CANVAS_HEIGHT / 2 - rulerHeight / 2;

if (canvas) {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
}
const ctx = canvas.getContext("2d");

const drawRec = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  type: "fill" | "stroke"
) => {
  if (ctx) {
    if (type === "fill") {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    } else if (type === "stroke") {
      ctx.strokeStyle = color;
      ctx.strokeRect(x, y, width, height);
    }
  }
};

const drawLine = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string
) => {
  if (ctx) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
};

// Vẽ nền của canvas
drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "gray", "fill");

const drawRuler = () => {
  // Vẽ viền
  // drawRec(START_X, START_Y, width, height, "black", "stroke");
  drawRec(START_X, START_Y, rulerWidth, rulerHeight, "yellow", "fill");
};

drawRuler();

const playAnimaiton = () => {
  while (isAnimating) {
    drawRuler();
  }
};

const resetRuler = () => {
  drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "gray", "fill");
  drawRuler();
};

function devideRuler(start: number, end: number, height: number) {
  // Update thuộc tính của cây thước
  if (height <= 0) {
    isAnimating = false; // Stop animating
    return;
  } else isAnimating = true;

  const mid = (start + end) / 2;

  drawLine(mid, START_Y, mid, height + START_Y, "black");

  // Giảm 10 mỗi lần thay vì 1 vì 10 pixel là tốt hơn để ta nhìn thấy sự khác biệt
  // Đặt setTimeOut để thấy được quá trình thuật toán thực thi bằng mắt thường
  setTimeout(() => {
    devideRuler(start, mid, height - 10);
    devideRuler(end, mid, height - 10);
  }, 100);
}

devideRuler(START_X, START_X + rulerWidth, rulerHeight);

// UI stuffs
const startButton = document.querySelector("#start-btn") as HTMLButtonElement;
startButton.style.top = `${START_Y - 60}px`;
startButton.style.left = `${START_X + rulerWidth / 2 - 50}px`;

const saveButton = document.querySelector("#save-btn") as HTMLButtonElement;
saveButton.style.top = `${START_Y + 200}px`;
saveButton.style.left = `${START_X + rulerWidth / 2 - 20}px`;

saveButton.addEventListener("click", () => saveSetting());

const widthInput = document.querySelector("#width-input") as HTMLInputElement;
const heightInput = document.querySelector("#height-input") as HTMLInputElement;
widthInput.style.top = `${START_Y + rulerHeight + 40}px`;
heightInput.style.top = `${START_Y + rulerHeight + 40}px`;
widthInput.style.left = `${START_X + rulerWidth / 2 - 200}px`;
heightInput.style.left = `${START_X + rulerWidth / 2 + 20}px`;

const saveSetting = () => {
  if (!isAnimating) {
    const newWidth = parseInt(widthInput.value || "");
    const newHeight = parseInt(heightInput.value || "");

    rulerWidth = newWidth;
    rulerHeight = newHeight;
    START_X = CANVAS_WIDTH / 2 - rulerWidth / 2;
    START_Y = CANVAS_HEIGHT / 2 - rulerHeight / 2;

    resetRuler();
    drawRuler();
  }
};

startButton.addEventListener("click", () => {
  if (!isAnimating) {
    resetRuler();
    devideRuler(START_X, START_X + rulerWidth, rulerHeight);
  }
});
