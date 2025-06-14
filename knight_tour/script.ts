const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

// Có thể thay đổi tuỳ theo yêu cầu của người dùng
let boardSize = 8;
let cellSize = 60;
let isAnimating = false;
let animationDelay = 200;

let START_X = CANVAS_WIDTH / 2 - (boardSize * cellSize) / 2;
let START_Y = CANVAS_HEIGHT / 2 - (boardSize * cellSize) / 2;

if (canvas) {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
}
const ctx = canvas.getContext("2d");

// Các nước đi của con mã (8 hướng có thể)
const knightMoves = [
  [-2, -1],
  [-1, -2],
  [1, -2],
  [2, -1],
  [2, 1],
  [1, 2],
  [-1, 2],
  [-2, 1],
];

// Ma trận để lưu trạng thái bàn cờ
let chessBoard: number[][] = [];
let moveSequence: { row: number; col: number }[] = [];
let currentMoveCount = 0;

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
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
};

const drawText = (
  text: string,
  x: number,
  y: number,
  color: string,
  fontSize: number = 16
) => {
  if (ctx) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }
};

const drawCircle = (x: number, y: number, radius: number, color: string) => {
  if (ctx) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
};

// Vẽ nền của canvas
drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#2c3e50", "fill");

const initChessBoard = () => {
  chessBoard = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(-1));
  moveSequence = [];
  currentMoveCount = 0;
};

const drawChessBoard = () => {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const x = START_X + col * cellSize;
      const y = START_Y + row * cellSize;

      // Vẽ ô cờ với màu xen kẽ như bàn cờ vua
      const cellColor = (row + col) % 2 === 0 ? "#f4f4f4" : "#8b4513";
      drawRec(x, y, cellSize, cellSize, cellColor, "fill");

      // Vẽ viền cho mỗi ô
      drawRec(x, y, cellSize, cellSize, "#2c3e50", "stroke");

      // Vẽ số thứ tự nước đi nếu đã có
      if (chessBoard[row][col] !== -1) {
        drawText(
          (chessBoard[row][col] + 1).toString(),
          x + cellSize / 2,
          y + cellSize / 2,
          "#e74c3c",
          14
        );
      }
    }
  }
};

const drawMovePath = () => {
  // Vẽ đường đi của con mã
  for (let i = 0; i < moveSequence.length - 1; i++) {
    const currentPos = moveSequence[i];
    const nextPos = moveSequence[i + 1];

    const startX = START_X + currentPos.col * cellSize + cellSize / 2;
    const startY = START_Y + currentPos.row * cellSize + cellSize / 2;
    const endX = START_X + nextPos.col * cellSize + cellSize / 2;
    const endY = START_Y + nextPos.row * cellSize + cellSize / 2;

    drawLine(startX, startY, endX, endY, "#e67e22");
  }

  // Vẽ vị trí hiện tại của con mã
  if (moveSequence.length > 0) {
    const currentPos = moveSequence[moveSequence.length - 1];
    const x = START_X + currentPos.col * cellSize + cellSize / 2;
    const y = START_Y + currentPos.row * cellSize + cellSize / 2;
    drawCircle(x, y, 12, "#e74c3c");
    drawText("♞", x, y, "white", 18);
  }
};

const resetChessBoard = () => {
  drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#2c3e50", "fill");
  initChessBoard();
  drawChessBoard();
};

const isValidMove = (row: number, col: number): boolean => {
  return (
    row >= 0 &&
    row < boardSize &&
    col >= 0 &&
    col < boardSize &&
    chessBoard[row][col] === -1
  );
};

const getAccessibilityCount = (row: number, col: number): number => {
  let count = 0;
  for (const [deltaRow, deltaCol] of knightMoves) {
    const newRow = row + deltaRow;
    const newCol = col + deltaCol;
    if (isValidMove(newRow, newCol)) {
      count++;
    }
  }
  return count;
};

const getNextMoves = (
  row: number,
  col: number
): { row: number; col: number; accessibility: number }[] => {
  const possibleMoves: { row: number; col: number; accessibility: number }[] =
    [];

  for (const [deltaRow, deltaCol] of knightMoves) {
    const newRow = row + deltaRow;
    const newCol = col + deltaCol;
    if (isValidMove(newRow, newCol)) {
      possibleMoves.push({
        row: newRow,
        col: newCol,
        accessibility: getAccessibilityCount(newRow, newCol),
      });
    }
  }

  // Sắp xếp theo quy tắc Warnsdorff (ưu tiên ô có ít lựa chọn tiếp theo)
  possibleMoves.sort((a, b) => a.accessibility - b.accessibility);
  return possibleMoves;
};

function solveKnightTour(row: number, col: number, moveCount: number) {
  if (!isAnimating) return;

  // Đánh dấu ô hiện tại
  chessBoard[row][col] = moveCount;
  moveSequence.push({ row, col });
  currentMoveCount = moveCount;

  // Vẽ lại bàn cờ với trạng thái mới
  drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#2c3e50", "fill");
  drawChessBoard();
  drawMovePath();

  // Kiểm tra xem đã hoàn thành tour chưa
  if (moveCount === boardSize * boardSize - 1) {
    drawText(
      "Hoàn thành Knight's Tour!",
      CANVAS_WIDTH / 2,
      START_Y - 50,
      "#27ae60",
      24
    );
    isAnimating = false;
    return;
  }

  const nextMoves = getNextMoves(row, col);

  if (nextMoves.length === 0) {
    // Không có nước đi tiếp theo, backtrack
    setTimeout(() => {
      chessBoard[row][col] = -1;
      moveSequence.pop();

      drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#2c3e50", "fill");
      drawChessBoard();
      drawMovePath();
    }, animationDelay);
    return;
  }

  // Thử nước đi tiếp theo
  setTimeout(() => {
    for (const move of nextMoves) {
      if (isAnimating) {
        solveKnightTour(move.row, move.col, moveCount + 1);
        break; // Chỉ thử nước đi đầu tiên (greedy approach)
      }
    }
  }, animationDelay);
}

const startKnightTour = () => {
  if (!isAnimating) {
    isAnimating = true;
    resetChessBoard();

    // Bắt đầu từ góc trên trái (0,0)
    setTimeout(() => {
      solveKnightTour(0, 0, 0);
    }, 500);
  }
};

const saveSetting = () => {
  if (!isAnimating) {
    const newBoardSize = parseInt(boardSizeInput.value || "8");
    const newAnimationDelay = parseInt(speedInput.value || "200");

    if (newBoardSize >= 4 && newBoardSize <= 10) {
      boardSize = newBoardSize;
      cellSize = Math.min(60, Math.floor(500 / boardSize));
    }

    if (newAnimationDelay >= 50 && newAnimationDelay <= 2000) {
      animationDelay = newAnimationDelay;
    }

    START_X = CANVAS_WIDTH / 2 - (boardSize * cellSize) / 2;
    START_Y = CANVAS_HEIGHT / 2 - (boardSize * cellSize) / 2;

    resetChessBoard();
    updateUIPositions();
  }
};

const updateUIPositions = () => {
  startButton.style.top = `${START_Y - 60}px`;
  startButton.style.left = `${START_X}px`;

  stopButton.style.top = `${START_Y - 60}px`;
  stopButton.style.left = `${START_X + 120}px`;

  resetButton.style.top = `${START_Y - 60}px`;
  resetButton.style.left = `${START_X + 240}px`;

  saveButton.style.top = `${START_Y + boardSize * cellSize + 80}px`;
  saveButton.style.left = `${START_X + (boardSize * cellSize) / 2 - 40}px`;

  boardSizeInput.style.top = `${START_Y + boardSize * cellSize + 40}px`;
  boardSizeInput.style.left = `${START_X}px`;

  speedInput.style.top = `${START_Y + boardSize * cellSize + 40}px`;
  speedInput.style.left = `${START_X + 200}px`;
};

// Khởi tạo
initChessBoard();
drawChessBoard();

// UI elements
const startButton = document.querySelector("#start-btn") as HTMLButtonElement;
const stopButton = document.querySelector("#stop-btn") as HTMLButtonElement;
const resetButton = document.querySelector("#reset-btn") as HTMLButtonElement;
const saveButton = document.querySelector("#save-btn") as HTMLButtonElement;
const boardSizeInput = document.querySelector(
  "#board-size-input"
) as HTMLInputElement;
const speedInput = document.querySelector("#speed-input") as HTMLInputElement;

// Đặt giá trị mặc định cho input
boardSizeInput.value = boardSize.toString();
speedInput.value = animationDelay.toString();

// Đặt vị trí UI elements
updateUIPositions();

// Event listeners
startButton.addEventListener("click", startKnightTour);

stopButton.addEventListener("click", () => {
  isAnimating = false;
});

resetButton.addEventListener("click", () => {
  isAnimating = false;
  resetChessBoard();
});

saveButton.addEventListener("click", saveSetting);
