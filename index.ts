// const url = 'http://127.0.0.1:3000/' ;
const url = "https://digit-reckognizer-api.herokuapp.com/"

let grid : HTMLDivElement|null ;
let n : number = 8;

grid = document.querySelector(".grid")
let temp :string = "" ;
for(let i:number = 0 ; i < n ; i ++){
    temp += "<div class='row'>" ;
    for(let j:number = 0 ; j < n ; j ++){
        temp += `<div id=${'elem'+i+'-'+j} class='elem'></div>` ;
    }
    temp += "</div>" ;
}
if(grid)
    grid.innerHTML = temp ;

let drawing : boolean = false ;

let matrix : number[][] = [];

for(let i:number = 0 ; i < n ; i ++){
    matrix.push([]);
    for(let j:number = 0 ; j < n ; j ++){
        matrix[i].push(0) ;
    }
}


const prediction : HTMLHeadingElement = document.querySelector(".prediction") as HTMLHeadingElement ;


grid?.addEventListener("mousedown",()=>{drawing = true;})
grid?.addEventListener("mouseup",()=>{drawing = false;})

function handleClick(target:HTMLElement ,i:number,j:number){
    target?.classList.add("clicked");
    matrix[i][j] = 15 ;

    fetch(url,{
        method:'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin' : 'http://127.0.0.1'
        'Access-Control-Allow-Origin' : 'https://digit-reckognizer-api.herokuapp.com/'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', 

        body: JSON.stringify(matrix)
    }).then(response => response.json())
      .then(data => {
            prediction.innerHTML = data.prediction ;
            console.log(JSON.stringify(matrix)) ;
      });

    let element = document.querySelector(".instruction") ;
    if(element && element.parentNode)
        element.parentNode.removeChild(element);
}

for(let i:number = 0 ; i < n ; i ++){
    for(let j:number = 0 ; j < n ; j ++){
        let elem : HTMLDivElement|null = document.querySelector('#elem'+i+'-'+j) ;
        // console.log(elem) ;
        elem?.addEventListener("mouseover",(e) => {
            const target = e.target as HTMLElement;
            if(drawing){
                handleClick(target,i,j) ;
            }
        })
        elem?.addEventListener("click",(e) => {
            const target = e.target as HTMLElement;
            handleClick(target,i,j) ;          
        })
        elem?.addEventListener("touchenter", (e) => {
            const target = e.target as HTMLElement;
            handleClick(target,i,j) ;  
        });
        elem?.addEventListener("touchstart", (e) => {
            const target = e.target as HTMLElement;
            handleClick(target,i,j) ;  
        });
    }
}

const resetButton : HTMLButtonElement|null = document.querySelector(".reset") ;
resetButton?.addEventListener("click",()=>{
    for(let i:number = 0 ; i < n ; i ++){
        for(let j:number = 0 ; j < n ; j ++){
            matrix[i][j] = 0 ;
            let elem : HTMLDivElement|null = document.querySelector('#elem'+i+'-'+j) ;
            elem?.classList.remove("clicked")
            prediction.innerHTML = "None";
        }
    }  
})
