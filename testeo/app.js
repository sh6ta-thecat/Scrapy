let canvas = document.getElementById("canvas");

let blocks = [];
let connections = [];

let idCounter = 0;

// DRAG desde sidebar
document.querySelectorAll(".block").forEach(block => {
    block.addEventListener("dragstart", e => {
        e.dataTransfer.setData("type", block.dataset.type);
    });
});

// DROP en canvas
canvas.addEventListener("dragover", e => e.preventDefault());

canvas.addEventListener("drop", e => {
    let type = e.dataTransfer.getData("type");

    createNode(type, e.offsetX, e.offsetY);
});

function createNode(type, x, y) {
    let id = "node_" + idCounter++;

    let node = document.createElement("div");
    node.className = "node";
    node.style.left = x + "px";
    node.style.top = y + "px";
    node.innerHTML = `
        <strong>${type}</strong><br>
        <input placeholder="config" />
    `;

    canvas.appendChild(node);

    makeDraggable(node);

    blocks.push({
        id,
        type,
        config: ""
    });

    node.dataset.id = id;

    node.addEventListener("click", () => {
        selectNode(id);
    });
}

// DRAG interno
function makeDraggable(el) {
    let offsetX, offsetY;

    el.addEventListener("mousedown", e => {
        offsetX = e.offsetX;
        offsetY = e.offsetY;

        function move(e) {
            el.style.left = (e.pageX - canvas.offsetLeft - offsetX) + "px";
            el.style.top = (e.pageY - canvas.offsetTop - offsetY) + "px";
        }

        function up() {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
        }

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
    });
}

// Selección y conexión simple
let selected = null;

function selectNode(id) {
    if (!selected) {
        selected = id;
    } else {
        connections.push({ from: selected, to: id });
        selected = null;
        updateCode();
    }
}

// GENERAR CÓDIGO
function updateCode() {
    let code = "<?php\n";

    connections.forEach((conn, i) => {
        let from = blocks.find(b => b.id === conn.from);

        code += "// Paso " + (i+1) + ": " + from.type + "\n";

        if (from.type === "url") {
            code += "$html = file_get_contents('URL_AQUI');\n";
        }

        if (from.type === "select") {
            code += "// Seleccionar elemento\n";
        }

        if (from.type === "text") {
            code += "// Extraer texto\n";
        }

        if (from.type === "attr") {
            code += "// Extraer atributo\n";
        }

        if (from.type === "output") {
            code += "echo $resultado;\n";
        }

        code += "\n";
    });

    document.getElementById("code").textContent = code;
}

// EJECUTAR (preview)
function runFlow() {
    fetch("api.php", {
        method: "POST",
        body: JSON.stringify({
            blocks,
            connections
        })
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById("preview").innerText = data.result;
    });
}

// Auto ejecutar cada 2s
setInterval(runFlow, 2000);
