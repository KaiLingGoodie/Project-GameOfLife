const unitLength = 20;
const boxColor = 150;
// Math.floor(Math.random(256)),Math.floor(Math.random(256)),Math.floor(Math.random(256))
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */

let currentBoard;
let nextBoard;
let changecolor;
let choosecolor = [0, 255, 0, 255];
let loneliness = 2
let overpopulation = 3
let reproduction = 3
var rainbow = changecolor;
let isPatternPreview = false
let keyboardX = 0
let keyboardY = 0
let rainbowColor;


function randomno(number) {
    return Math.floor(Math.random() * number)
}

function setup() {
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth, windowHeight - 100);
    canvas.parent(document.querySelector('#canvas'));


    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
}

function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = { age: 0, color: [255, 255, 255, 255], pattern: false };
            nextBoard[i][j] = { age: 0, color: [255, 255, 255, 255], pattern: false }
            // currentBoard[i][j] = 0;
            // nextBoard[i][j] = 0;
        }
    }
}
// currentBoard[i][j]=random()>0.8?{age:1,color:[255,0,0,255],}:{age:0,color:[255,255,255,255]};
// nextBoard[i][j]= {age:0,color:[255,255,255,255]}

let rangeslider = document.querySelector('#customRange2');
let output = document.getElementById("demo");
output.innerHTML = rangeslider.value;

rangeslider.oninput = function () {
    output.innerHTML = this.value;

}

function draw() {
    console.log('draw')
    // let color = changecolor;
    background(255);
    generate();
    frameRate(parseInt(output.innerHTML));
    // console.log(output.innerHTML);
    updateCanvas()

}
function updateCanvas() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j].age == 1) {
                fill(currentBoard[i][j].color);
                // console.log(currentBoard[i][j].color)
            } else {
                fill(30, 30, 30);
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}

function generate() {

    let isRandom;
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows].age;
                }
            }

            // Rules of Life
            if (currentBoard[x][y].age == 1 && neighbors < loneliness) {
                // Die of Loneliness
                nextBoard[x][y].age = 0;
            } else if (currentBoard[x][y].age == 1 && neighbors > overpopulation) {
                // Die of Overpopulation
                nextBoard[x][y].age = 0;
            } else if (currentBoard[x][y].age == 0 && neighbors == reproduction) {
                // New life due to Reproduction
                nextBoard[x][y].age = 1;
                nextBoard[x][y].color = rainbowColor ? randomColor() : choosecolor;
                // nextBoardcolor = choosecolor
            } else {
                // Stasis
                // nextBoard[x][y] = currentBoard[x][y];
                nextBoard[x][y].age = currentBoard[x][y].age;
                nextBoard[x][y].color = currentBoard[x][y].color;
            }
        }
        changecolor = [randomno(255), randomno(255), randomno(255), 255]
        // console.log(changecolor);
    }


    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function randomColor() {
    return [randomno(255), randomno(255), randomno(255), 255];
}


document.querySelector('#choosecolor').addEventListener("change", function (event) {
    if (event.currentTarget.value == 1) {
        rainbowColor = true
        return rainbowColor
    } else if (event.currentTarget.value == 2) {
        choosecolor = [0, 0, 255, 255]
        return rainbowColor = false
    } else if (event.currentTarget.value == 3) {
        choosecolor = [255, 0, 0, 255]
        return rainbowColor = false
    }

    // choosecolor = event.target.value
})

document.querySelector('#loneliness').addEventListener("change", function (event) {
    loneliness = event.currentTarget.value
})

document.querySelector('#overpopulation').addEventListener("change", function (event) {
    overpopulation = event.currentTarget.value
})

document.querySelector('#reproduction').addEventListener("change", function (event) {
    reproduction = event.currentTarget.value
})


function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseY < 1) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y].age = 1;
    console.log(currentBoard[x][y].age)
    currentBoard[x][y].color = choosecolor;
    // console.log(x , y , currentBoard[x][y].color)
    fill(94, 92, 92);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
    noLoop();
    mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseY < 1) {
        return;
    }
    loop();
}

// document.querySelector('#customRange1').addEventListener('click', function(){

// })

document.querySelector('#reset-game')
    .addEventListener('click', function () {
        init();
    });

document.querySelector("#start-random").addEventListener('click', function () {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j].age = (Math.random() > 0.5) ? 1 : 0;
        }
    };
});

let startstopbtn = document.querySelector('#btnstartstop')
startstopbtn.addEventListener('click', function () {
    if (startstopbtn.textContent === "Start") {
        startstopbtn.textContent = "Stop";
        isPatternPreview = false
        loop()
    } else {
        noLoop();
        startstopbtn.textContent = "Start";
    }

});






let patterns =
    [[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0]]




let value = 0;
function human(assignOnBoard = false) {
    isPatternPreview = true
    for (let i = 0; i < patterns.length; i++) {
        for (let j = 0; j < patterns[0].length; j++) {
            if (patterns[i][j] == 1) {
                if (assignOnBoard) {
                    currentBoard[j + keyboardX][rows - patterns.length + i + keyboardY].age = 1;
                    currentBoard[j + keyboardX][rows - patterns.length + i + keyboardY].pattern = true;
                }

                fill('yellow')
                rect(
                    ((j + keyboardX) * unitLength),
                    (rows - patterns.length + i + keyboardY) * unitLength,
                    unitLength,
                    unitLength
                )
            }
        }
    }
}

document.querySelector('#human')
    .addEventListener('click', function () {
        human()
        // console.log(human())
        console.log("current board:", currentBoard[0][0].pattern);

    });


window.addEventListener('keydown', function (event) {
    const preventDefaultCode = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"]
    let eventCode = event.code;
    if (preventDefaultCode.indexOf(eventCode) != -1) {
        event.preventDefault();
    }

    if (!isPatternPreview) {
        console.log('isPatternPreview is off')
        return
    }

    if (eventCode === "ArrowUp") {
        keyboardY -= 1
    }
    if (eventCode === "ArrowDown") {
        keyboardY += 1
    }
    if (eventCode === "ArrowLeft") {
        keyboardX -= 1
    }
    if (eventCode === "ArrowRight") {
        keyboardX += 1
    }

    updateCanvas()

    if (eventCode === "Space") {
        console.log('space pressing')
        human(true)
    } else {
        human(false)
    }



})




window.addEventListener("resize", function () {
    setup()
})

// let patterninput = document.querySelector('#patterninput');
// patterninput.addEventListener('input', function () {
//     patterntrans()
// });

// let pattern = `...O
// ....O.O.
// ..OOO..

// ..O..`

// function patterntrans() {
//     function splitPattern(patterninput) {
//         patternRowStringArray = pattern.split("\n")
//     }

//     console.log(patternRowStringArray)

//     let pattern2DArray = []

//     for (i in patternRowStringArray) {
//         let patternRowArray = []
//         for (j of patternRowStringArray[i]) {
//             if (j == ".") {
//                 patternRowArray.push(0)
//             } else {
//                 patternRowArray.push(1)
//             }
//         }
//         pattern2DArray.push(patternRowArray)
//     }
//     console.log(pattern2DArray)

//     function insertPattern(patternArray) {
//         let patternWidth = getPatternWidth(patternArray)
//         let patternHeight = patternArray.length
//         let currentBoard = []
//         console.log(patternHeight)
//         for (i = 0; i < patternHeight; i++) {
//             currentBoard[i] = []
//             for (j = 0; j < patternWidth; j++) {
//                 if (patternArray[i][j]) {
//                     currentBoard[i][j] = patternArray[i][j]
//                 } else {
//                     currentBoard[i][j] = 0
//                 }
//             }
//         }
//         console.log(currentBoard);
//     }

//     function getPatternWidth(patternArray) {
//         let rowLengthArray = []
//         for (row of patternArray) {
//             rowLengthArray.push(row.length)
//         }
//         return Math.max(...rowLengthArray)
//     }

//     insertPattern(pattern2DArray)
//     function human() {
//         for (let i = 0; i < patterns.length; i++) {
//             for (let j = 0; j < patterns[0].length; j++) {
//                 if (patterns[i][j] == 1) {

//                     currentBoard[j][i].age = 1;

//                 }

//             }

//         }

//     }
// }
