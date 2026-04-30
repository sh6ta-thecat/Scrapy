function topologicalSort(blocks, connections) {
    let graph = {};
    let indegree = {};

    blocks.forEach(b => {
        graph[b.id] = [];
        indegree[b.id] = 0;
    });

    connections.forEach(c => {
        graph[c.from].push(c.to);
        indegree[c.to]++;
    });

    let queue = [];
    for (let id in indegree) {
        if (indegree[id] === 0) queue.push(id);
    }

    let result = [];

    while (queue.length) {
        let node = queue.shift();
        result.push(node);

        graph[node].forEach(n => {
            indegree[n]--;
            if (indegree[n] === 0) queue.push(n);
        });
    }

    return result;
}