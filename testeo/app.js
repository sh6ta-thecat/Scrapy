let canvas = document.getElementById("canvas");
let svg = document.getElementById("connections");

let blocks = [];
let connections = [];
let idCounter = 0;
let selected = null;

document.querySelectorAll(".block").forEach(el => {
    el.draggable = true;
    el.ondragstart = e => e.dataTransfer.setData("type", el.dataset.type);
});

canvas.ondragover = e => e.preventDefault();

canvas.ondrop = e => {
    createNode(e.dataTransfer.getData("type"), e.offsetX, e.offsetY);
};

function createNode(type, x, y) {
    let id = "n" + idCounter++;

    let node = document.createElement("div");
    node.className = "node";
    node.style.left = x + "px";
    node.style.top = y + "px";

    node.innerHTML = `
        <b>${type}</b>
        <input placeholder="config">
    `;

    canvas.appendChild(node);

    blocks.push({ id, type, config: "" });

    node.querySelector("input").oninput = e => {
        blocks.find(b => b.id === id).config = e.target.value;
    };

    node.onclick = () => connectNode(id);

    makeDraggable(node);
}

function connectNode(id) {
    if (!selected) {
        selected = id;
    } else {
        connections.push({ from: selected, to: id });
        selected = null;
        drawConnections();
    }
}

function drawConnections() {
    svg.innerHTML = "";

    connections.forEach(c => {
        let a = document.querySelector(`[data-id="${c.from}"]`);
        let b = document.querySelector(`[data-id="${c.to}"]`);
        if (!a || !b) return;

        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        line.setAttribute("x1", a.offsetLeft + 90);
        line.setAttribute("y1", a.offsetTop + 20);
        line.setAttribute("x2", b.offsetLeft + 90);
        line.setAttribute("y2", b.offsetTop + 20);

        line.setAttribute("stroke", "white");

        svg.appendChild(line);
    });
}

/* RUN */
function runFlow() {

    let ordered = topologicalSort(blocks, connections);

    fetch("api.php", {
        method: "POST",
        body: JSON.stringify({ blocks, connections, ordered })
    })
    .then(r => r.json())
    .then(d => {
        document.getElementById("preview").innerText = JSON.stringify(d.result, null, 2);
    });
}