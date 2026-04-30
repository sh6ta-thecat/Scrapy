function drawConnections(blocks, connections) {
    let svg = document.getElementById("connections");
    svg.innerHTML = "";

    connections.forEach(c => {
        let from = document.querySelector(`[data-id="${c.from}"]`);
        let to = document.querySelector(`[data-id="${c.to}"]`);

        if (!from || !to) return;

        let x1 = from.offsetLeft + from.offsetWidth;
        let y1 = from.offsetTop + from.offsetHeight / 2;

        let x2 = to.offsetLeft;
        let y2 = to.offsetTop + to.offsetHeight / 2;

        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        let d = `M ${x1} ${y1} C ${x1+50} ${y1}, ${x2-50} ${y2}, ${x2} ${y2}`;

        path.setAttribute("d", d);
        path.setAttribute("stroke", "#00ffcc");
        path.setAttribute("fill", "none");

        svg.appendChild(path);
    });
}