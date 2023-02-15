const table = document.querySelector("table");
let box = document.getElementsByClassName("cell")
let rows = document.getElementsByClassName('row')
const start_btn = document.getElementById('start')
const choose_start_btn = document.getElementById('choose_start')
const choose_target_btn = document.getElementById('choose_target')
const walls = document.getElementById('walls')
const reset = document.getElementById('reset')
const clearWalls = document.getElementById('clear_walls')
var option = ""

const className = "block";
let mouseIsDown = false;

var has_start = false
var has_target = false

let start
let target

function check_block_and_start_or_target(){
    //This fucnction check if one ceoll have target  and block if it has, then remove block
    for (let index = 0; index < box.length; index++) {
        if((box[index].classList.contains("start") && box[index].classList.contains("block"))||(box[index].classList.contains("target") && box[index].classList.contains("block"))){
            box[index].classList.remove('block')
        }
        
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  
function get_neighbours(col){
    row = col.closest("tr").rowIndex
    column = col.cellIndex
    res = []
    if (column + 1 < 55 &&  !table.rows[row].cells[column + 1 ].classList.contains("block")){
        right_neighbour = table.rows[row].cells[column + 1 ].dataset.index
    }
    else{
        right_neighbour = null
    }

    if(column - 1 >= 0 && !table.rows[row].cells[column - 1 ].classList.contains("block")){
        left_neighbour = table.rows[row].cells[column - 1].dataset.index
    }
    else{
        left_neighbour = null
    }

    if(row - 1 >= 0 && !table.rows[row - 1].cells[column].classList.contains("block")){
        top_neighbour = table.rows[row - 1].cells[column].dataset.index
    }
    else{
        top_neighbour = null
    }

    if(row + 1 < rows.length && !table.rows[row + 1].cells[column].classList.contains("block")){
        bottom_neighbour = table.rows[row+1].cells[column].dataset.index
    }
    else{
        bottom_neighbour = null
    }
    l = [right_neighbour, left_neighbour, top_neighbour, bottom_neighbour]

    for(let i = 0; i < l.length; i ++){
        if (l[i] != null){
            res.push(l[i])
        }
    }
    return res
}


async function find_shortest_path(graph, start, target){
    let visited = new Set();
    let queue = [[start, 0],]
    const previous = {};
    let found = false

    while(queue.length > 0)
    {
         [cur, distance] = queue.shift()

         if(cur == target){
            found = true
            break
         }

         for(neighbour of graph[cur][0])
         {
             // console.log("n"+neighbour)
             if (!visited.has(neighbour)){
                 box[neighbour].style.background = "#3dc7e3"
                 visited.add(neighbour)
                 queue.push([neighbour, distance + 1])
                 previous[neighbour] = cur; 
             }

         }
        await sleep(5);
    }

    console.log(previous)
    // Get shortest path elements
    const path = [];
    if(found){
        let current = target;
        while (current !== start) {
            path.unshift(current);
            current = previous[current];
        }
        path.unshift(start);
    
        // paint path
        
        for (let index = 0; index < path.length; index++) {
            box[path[index]].style.background = "yellow"
            await sleep(20);
        }
        box[start].style.background = "aquamarine"
        box[target].style.background = "brown"
    }


    return path;
        
}


function format_graph(){
    let n = {}
    for (let index = 0; index < box.length; index++){
        if (n[index] == undefined && !box[index].classList.contains("block")){
            n[index] = [get_neighbours(box[index])]
        }
    }
    return n
}


start_btn.addEventListener('click', () =>{
    check_block_and_start_or_target()
    graph = format_graph()
    console.log(find_shortest_path(graph, start, target))
    
})


choose_start_btn.addEventListener("click", function add_start(e){
    option = "choose_start"

    for (let index = 0; index < box.length; index++) {
        box[index].addEventListener('click', (e) =>{
            try{
                box[index].removeEventListener("click", add_target)
            }
            catch{}
            if(has_start == false){
                box[index].classList.add('start')
                has_start = true
                start = index
            }

        })
    }
})

choose_target_btn.addEventListener('click', (e) => {
    option = "choose_target"
    for (let index = 0; index < box.length; index++) {
        box[index].addEventListener('click', (e) =>{
            try{
                box[index].removeEventListener("click", add_start)
            }
            catch{}
            if(has_target == false){
                box[index].classList.add('target')

                has_target = true
                target = index
            }

        })
    }
})


walls.addEventListener('click', function add_walls() {
    option = "walls"
    const colorTd = (e) => (e.target.tagName == "TD" && e.target.classList.add("block") && e.target.classList.contains("start")== false && e.target.classList.contains("target") == false);
    table.onclick = (e) => colorTd(e);

    table.onmousedown = (e) => {
      mouseIsDown = true;
      colorTd(e);
    };

    table.onmouseup = () => {
        mouseIsDown = false
    };
    table.onmouseover = (e) => mouseIsDown && colorTd(e);
})


reset.addEventListener('click', () => {
    window.location.reload()
    
})

clearWalls.addEventListener('click', function add_walls() {
    option = "walls"
    const colorTd = (e) => (e.target.tagName == "TD" && e.target.classList.remove("block") && e.target.classList.contains("start")== false && e.target.classList.contains("target") == false);
    table.onclick = (e) => colorTd(e);

    table.onmousedown = (e) => {
      mouseIsDown = true;
      colorTd(e);
    };

    table.onmouseup = () => {
        mouseIsDown = false
    };
    table.onmouseover = (e) => mouseIsDown && colorTd(e);
})
