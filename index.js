"use strict";
// const url = 'http://127.0.0.1:3000/' ;
const url = "https://digit-reckognizer-api.herokuapp.com/";
let grid;
let n = 8;
grid = document.querySelector(".grid");
let temp = "";
for (let i = 0; i < n; i++) {
    temp += "<div class='row'>";
    for (let j = 0; j < n; j++) {
        temp += `<div id=${'elem' + i + '-' + j} class='elem'></div>`;
    }
    temp += "</div>";
}
if (grid)
    grid.innerHTML = temp;
let drawing = false;
let matrix = [];
for (let i = 0; i < n; i++) {
    matrix.push([]);
    for (let j = 0; j < n; j++) {
        matrix[i].push(0);
    }
}
const prediction = document.querySelector(".prediction");
grid === null || grid === void 0 ? void 0 : grid.addEventListener("mousedown", () => { drawing = true; });
grid === null || grid === void 0 ? void 0 : grid.addEventListener("mouseup", () => { drawing = false; });
function handleClick(target, i, j) {
    target === null || target === void 0 ? void 0 : target.classList.add("clicked");
    matrix[i][j] = 15;
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin' : 'http://127.0.0.1'
            'Access-Control-Allow-Origin': 'https://digit-reckognizer-api.herokuapp.com/'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(matrix)
    }).then(response => response.json())
        .then(data => {
        prediction.innerHTML = data.prediction;
        console.log(JSON.stringify(matrix));
    });
    let element = document.querySelector(".instruction");
    if (element && element.parentNode)
        element.parentNode.removeChild(element);
}
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        let elem = document.querySelector('#elem' + i + '-' + j);
        // console.log(elem) ;
        elem === null || elem === void 0 ? void 0 : elem.addEventListener("mouseover", (e) => {
            const target = e.target;
            if (drawing) {
                handleClick(target, i, j);
            }
        });
        elem === null || elem === void 0 ? void 0 : elem.addEventListener("click", (e) => {
            const target = e.target;
            handleClick(target, i, j);
        });
        elem === null || elem === void 0 ? void 0 : elem.addEventListener("touchenter", (e) => {
            const target = e.target;
            handleClick(target, i, j);
        });
        elem === null || elem === void 0 ? void 0 : elem.addEventListener("touchstart", (e) => {
            const target = e.target;
            handleClick(target, i, j);
        });
    }
}
const resetButton = document.querySelector(".reset");
resetButton === null || resetButton === void 0 ? void 0 : resetButton.addEventListener("click", () => {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrix[i][j] = 0;
            let elem = document.querySelector('#elem' + i + '-' + j);
            elem === null || elem === void 0 ? void 0 : elem.classList.remove("clicked");
            prediction.innerHTML = "None";
        }
    }
});
