var canvas = document.getElementById("canvas");
var CANVAS_WIDTH = window.innerWidth;
var CANVAS_HEIGHT = window.innerHeight;
// Có thể thay đổi tuỳ theo yêu cầu của người dùng
var boardSize = 8;
var cellSize = 60;
var isAnimating = false;
var animationDelay = 200;
var START_X = CANVAS_WIDTH / 2 - (boardSize * cellSize) / 2;
var START_Y = CANVAS_HEIGHT / 2 - (boardSize * cellSize) / 2;
if (canvas) {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
}
var ctx = canvas.getContext("2d");
// Các nước đi của con mã (8 hướng có thể)
var knightMoves = [
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
var chessBoard = [];
var moveSequence = [];
var currentMoveCount = 0;
var drawRec = function (x, y, width, height, color, type) {
    if (ctx) {
        if (type === "fill") {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        }
        else if (type === "stroke") {
            ctx.strokeStyle = color;
            ctx.strokeRect(x, y, width, height);
        }
    }
};
var drawLine = function (startX, startY, endX, endY, color) {
    if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
};
var drawText = function (text, x, y, color, fontSize) {
    if (fontSize === void 0) { fontSize = 16; }
    if (ctx) {
        ctx.fillStyle = color;
        ctx.font = "".concat(fontSize, "px Arial");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
    }
};
var drawCircle = function (x, y, radius, color) {
    if (ctx) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }
};
// Vẽ nền của canvas
drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#2c3e50", "fill");
var initChessBoard = function () {
    chessBoard = Array(boardSize)
        .fill(null)
        .map(function () { return Array(boardSize).fill(-1); });
    moveSequence = [];
    currentMoveCount = 0;
};
var drawChessBoard = function () {
    for (var row = 0; row < boardSize; row++) {
        for (var col = 0; col < boardSize; col++) {
            var x = START_X + col * cellSize;
            var y = START_Y + row * cellSize;
            // Vẽ ô cờ với màu xen kẽ như bàn cờ vua
            var cellColor = (row + col) % 2 === 0 ? "#f4f4f4" : "#8b4513";
            drawRec(x, y, cellSize, cellSize, cellColor, "fill");
            // Vẽ viền cho mỗi ô
            drawRec(x, y, cellSize, cellSize, "#2c3e50", "stroke");
            // Vẽ số thứ tự nước đi nếu đã có
            if (chessBoard[row][col] !== -1) {
                drawText((chessBoard[row][col] + 1).toString(), x + cellSize / 2, y + cellSize / 2, "#e74c3c", 14);
            }
        }
    }
};
var drawMovePath = function () {
    // Vẽ đường đi của con mã
    for (var i = 0; i < moveSequence.length - 1; i++) {
        var currentPos = moveSequence[i];
        var nextPos = moveSequence[i + 1];
        var startX = START_X + currentPos.col * cellSize + cellSize / 2;
        var startY = START_Y + currentPos.row * cellSize + cellSize / 2;
        var endX = START_X + nextPos.col * cellSize + cellSize / 2;
        var endY = START_Y + nextPos.row * cellSize + cellSize / 2;
        drawLine(startX, startY, endX, endY, "#e67e22");
    }
    // Vẽ vị trí hiện tại của con mã
    if (moveSequence.length > 0) {
        var currentPos = moveSequence[moveSequence.length - 1];
        var x = START_X + currentPos.col * cellSize + cellSize / 2;
        var y = START_Y + currentPos.row * cellSize + cellSize / 2;
        drawCircle(x, y, 12, "#e74c3c");
        drawText("♞", x, y, "white", 18);
    }
};
var resetChessBoard = function () {
    drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#2c3e50", "fill");
    initChessBoard();
    drawChessBoard();
};
var isValidMove = function (row, col) {
    return (row >= 0 &&
        row < boardSize &&
        col >= 0 &&
        col < boardSize &&
        chessBoard[row][col] === -1);
};
var getAccessibilityCount = function (row, col) {
    var count = 0;
    for (var _i = 0, knightMoves_1 = knightMoves; _i < knightMoves_1.length; _i++) {
        var _a = knightMoves_1[_i], deltaRow = _a[0], deltaCol = _a[1];
        var newRow = row + deltaRow;
        var newCol = col + deltaCol;
        if (isValidMove(newRow, newCol)) {
            count++;
        }
    }
    return count;
};
var getNextMoves = function (row, col) {
    var possibleMoves = [];
    for (var _i = 0, knightMoves_2 = knightMoves; _i < knightMoves_2.length; _i++) {
        var _a = knightMoves_2[_i], deltaRow = _a[0], deltaCol = _a[1];
        var newRow = row + deltaRow;
        var newCol = col + deltaCol;
        if (isValidMove(newRow, newCol)) {
            possibleMoves.push({
                row: newRow,
                col: newCol,
                accessibility: getAccessibilityCount(newRow, newCol),
            });
        }
    }
    // Sắp xếp theo quy tắc Warnsdorff (ưu tiên ô có ít lựa chọn tiếp theo)
    possibleMoves.sort(function (a, b) { return a.accessibility - b.accessibility; });
    return possibleMoves;
};
function solveKnightTour(row, col, moveCount) {
    if (!isAnimating)
        return;
    // Đánh dấu ô hiện tại
    chessBoard[row][col] = moveCount;
    moveSequence.push({ row: row, col: col });
    currentMoveCount = moveCount;
    // Vẽ lại bàn cờ với trạng thái mới
    drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#2c3e50", "fill");
    drawChessBoard();
    drawMovePath();
    // Kiểm tra xem đã hoàn thành tour chưa
    if (moveCount === boardSize * boardSize - 1) {
        drawText("Hoàn thành Knight's Tour!", CANVAS_WIDTH / 2, START_Y - 50, "#27ae60", 24);
        isAnimating = false;
        return;
    }
    var nextMoves = getNextMoves(row, col);
    if (nextMoves.length === 0) {
        // Không có nước đi tiếp theo, backtrack
        setTimeout(function () {
            chessBoard[row][col] = -1;
            moveSequence.pop();
            drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#2c3e50", "fill");
            drawChessBoard();
            drawMovePath();
        }, animationDelay);
        return;
    }
    // Thử nước đi tiếp theo
    setTimeout(function () {
        for (var _i = 0, nextMoves_1 = nextMoves; _i < nextMoves_1.length; _i++) {
            var move = nextMoves_1[_i];
            if (isAnimating) {
                solveKnightTour(move.row, move.col, moveCount + 1);
                break; // Chỉ thử nước đi đầu tiên (greedy approach)
            }
        }
    }, animationDelay);
}
var startKnightTour = function () {
    if (!isAnimating) {
        isAnimating = true;
        resetChessBoard();
        // Bắt đầu từ góc trên trái (0,0)
        setTimeout(function () {
            solveKnightTour(0, 0, 0);
        }, 500);
    }
};
var saveSetting = function () {
    if (!isAnimating) {
        var newBoardSize = parseInt(boardSizeInput.value || "8");
        var newAnimationDelay = parseInt(speedInput.value || "200");
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
var updateUIPositions = function () {
    startButton.style.top = "".concat(START_Y - 60, "px");
    startButton.style.left = "".concat(START_X, "px");
    stopButton.style.top = "".concat(START_Y - 60, "px");
    stopButton.style.left = "".concat(START_X + 120, "px");
    resetButton.style.top = "".concat(START_Y - 60, "px");
    resetButton.style.left = "".concat(START_X + 240, "px");
    saveButton.style.top = "".concat(START_Y + boardSize * cellSize + 80, "px");
    saveButton.style.left = "".concat(START_X + (boardSize * cellSize) / 2 - 40, "px");
    boardSizeInput.style.top = "".concat(START_Y + boardSize * cellSize + 40, "px");
    boardSizeInput.style.left = "".concat(START_X, "px");
    speedInput.style.top = "".concat(START_Y + boardSize * cellSize + 40, "px");
    speedInput.style.left = "".concat(START_X + 200, "px");
};
// Khởi tạo
initChessBoard();
drawChessBoard();
// UI elements
var startButton = document.querySelector("#start-btn");
var stopButton = document.querySelector("#stop-btn");
var resetButton = document.querySelector("#reset-btn");
var saveButton = document.querySelector("#save-btn");
var boardSizeInput = document.querySelector("#board-size-input");
var speedInput = document.querySelector("#speed-input");
// Đặt giá trị mặc định cho input
boardSizeInput.value = boardSize.toString();
speedInput.value = animationDelay.toString();
// Đặt vị trí UI elements
updateUIPositions();
// Event listeners
startButton.addEventListener("click", startKnightTour);
stopButton.addEventListener("click", function () {
    isAnimating = false;
});
resetButton.addEventListener("click", function () {
    isAnimating = false;
    resetChessBoard();
});
saveButton.addEventListener("click", saveSetting);
