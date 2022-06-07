let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let cells = document.getElementsByClassName("cell");

class wordC {
    isFound = false;

    constructor(word, startC, endC) {
        this.wordStr = word;
        [this.startX, this.startY] = startC;
        [this.endX, this.endY] = endC;
        [this.xDir, this.yDir] = direction(startC, endC);
    }
}

let words = [];
words.push(new wordC("KANGAROO", [1, 1], [8, 8]));
words.push(new wordC("ELEPHANT", [1, 2], [8, 9]));
words.push(new wordC("MALIBU", [2, 1], [2, 6]));

function coordinateToPos(c) {
    return ((c - 1) * 10 + 5) + "%";
}

function distance(c1, c2) {
    let [x1, y1] = c1;
    let [x2, y2] = c2;
    let distX = x2 - x1;
    let distY = y2 - y1;
    return [distX, distY];
}

function direction(c1, c2) {
    let [distX, distY] = distance(c1, c2);
    return [Math.sign(distX), Math.sign(distY)];
}

function isAligned(c1, c2) {
    let [distX, distY] = distance(c1, c2);
    return (Math.abs(distX) == Math.abs(distY) || Boolean(distY == 0 ^ distX == 0));
}

function setRandLetter(cell) {
    cell.innerHTML = alphabet[Math.floor(Math.random() * alphabet.length)];
}

function getCell(c) {
    let [x, y] = c;
    return document.querySelector(`[data-x='${x}'][data-y='${y}']`)
}

function setWord(word) {
    let [x, y] = [word.startX, word.startY];
    for (let i = 0; i < word.wordStr.length; i++) {
        let cell = getCell([x, y]);
        cell.innerHTML = word.wordStr[i];
        x += word.xDir;
        y += word.yDir;
    }
}

window.onload = function () {
    let x1, x2, y1, y2;
    let state = 1;
    let wordsFound = 0;
    let lines = document.getElementsByClassName("WSLine");
    let line = lines[0];

    function drawLine() {
        line.setAttribute("x1", coordinateToPos(x1));
        line.setAttribute("y1", coordinateToPos(y1));
        line.setAttribute("x2", coordinateToPos(x2));
        line.setAttribute("y2", coordinateToPos(y2));
    }

    function lineInitiate(e) {
        if (state == 1) {
            let x = Number(e.target.dataset.x);
            let y = Number(e.target.dataset.y);
            [x1, y1] = [x, y];
            [x2, y2] = [x, y];
            line.dataset.state = "on";
            drawLine();
            state = 2;
        }
    }

    function lineUpdate(e) {
        if (state == 2) {
            let x = Number(e.target.dataset.x);
            let y = Number(e.target.dataset.y);
            [x2, y2] = [x, y];
            if (isAligned([x1, y1], [x, y])) {
                drawLine();
            }
        }
    }

    function lineFinish(e) {
        for (word of words) {
            if (((word.startX == x1 && word.endX == x2) ||
                (word.startX == x2 && word.endX == x1)) &&
                ((word.startY == y1 && word.endY == y2) ||
                (word.startY == y2 && word.endY == y1))) {
                if (!word.isFound) {
                    word.isFound = true;
                    line.dataset.state = "found";
                    wordsFound++;
                    line = lines[wordsFound];
                }
            }
        }
        line.dataset.state = "off";
        state = 1;
    }

    for (let cell of cells) {
        setRandLetter(cell);
        cell.addEventListener('mousedown', lineInitiate, false);
        cell.addEventListener('mouseover', lineUpdate, false);
        cell.addEventListener('mouseup', lineFinish, false);
    }

    words.forEach(setWord);
}