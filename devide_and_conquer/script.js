var canvas = document.getElementById("container");
var CANVAS_WIDTH = window.innerWidth;
var CANVAS_HEIGHT = window.innerHeight;
// Có thể thay đổi tuỳ theo yêu cầu của người dùng
var rulerWidth = 1000;
var rulerHeight = 100;
var isAnimating = true;
var START_X = CANVAS_WIDTH / 2 - rulerWidth / 2;
var START_Y = CANVAS_HEIGHT / 2 - rulerHeight / 2;
if (canvas) {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
}
var ctx = canvas.getContext("2d");
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
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
};
// Vẽ nền của canvas
drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "gray", "fill");
var drawRuler = function () {
    // Vẽ viền
    // drawRec(START_X, START_Y, width, height, "black", "stroke");
    drawRec(START_X, START_Y, rulerWidth, rulerHeight, "yellow", "fill");
};
drawRuler();
var playAnimaiton = function () {
    while (isAnimating) {
        drawRuler();
    }
};
var resetRuler = function () {
    drawRec(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "gray", "fill");
    drawRuler();
};
function devideRuler(start, end, height) {
    // Update thuộc tính của cây thước
    if (height <= 0) {
        isAnimating = false; // Stop animating
        return;
    }
    else
        isAnimating = true;
    var mid = (start + end) / 2;
    drawLine(mid, START_Y, mid, height + START_Y, "black");
    // Giảm 10 mỗi lần thay vì 1 vì 10 pixel là tốt hơn để ta nhìn thấy sự khác biệt
    // Đặt setTimeOut để thấy được quá trình thuật toán thực thi bằng mắt thường
    setTimeout(function () {
        devideRuler(start, mid, height - 10);
        devideRuler(end, mid, height - 10);
    }, 100);
}
devideRuler(START_X, START_X + rulerWidth, rulerHeight);
// UI stuffs
var startButton = document.querySelector("#start-btn");
startButton.style.top = "".concat(START_Y - 60, "px");
startButton.style.left = "".concat(START_X + rulerWidth / 2 - 50, "px");
var saveButton = document.querySelector("#save-btn");
saveButton.style.top = "".concat(START_Y + 200, "px");
saveButton.style.left = "".concat(START_X + rulerWidth / 2 - 20, "px");
saveButton.addEventListener("click", function () { return saveSetting(); });
var widthInput = document.querySelector("#width-input");
var heightInput = document.querySelector("#height-input");
widthInput.style.top = "".concat(START_Y + rulerHeight + 40, "px");
heightInput.style.top = "".concat(START_Y + rulerHeight + 40, "px");
widthInput.style.left = "".concat(START_X + rulerWidth / 2 - 200, "px");
heightInput.style.left = "".concat(START_X + rulerWidth / 2 + 20, "px");
var saveSetting = function () {
    if (!isAnimating) {
        var newWidth = parseInt(widthInput.value || "");
        var newHeight = parseInt(heightInput.value || "");
        rulerWidth = newWidth;
        rulerHeight = newHeight;
        START_X = CANVAS_WIDTH / 2 - rulerWidth / 2;
        START_Y = CANVAS_HEIGHT / 2 - rulerHeight / 2;
        resetRuler();
        drawRuler();
    }
};
startButton.addEventListener("click", function () {
    if (!isAnimating) {
        resetRuler();
        devideRuler(START_X, START_X + rulerWidth, rulerHeight);
    }
});
