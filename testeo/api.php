<?php

header("Content-Type: application/json");

// Leer JSON
$data = json_decode(file_get_contents("php://input"), true);

$blocks = $data["blocks"];
$connections = $data["connections"];

$html = "";
$result = "";

// Orden simple (MVP)
foreach ($connections as $conn) {

    $block = null;

    foreach ($blocks as $b) {
        if ($b["id"] === $conn["from"]) {
            $block = $b;
            break;
        }
    }

    if (!$block) continue;

    switch ($block["type"]) {

        case "url":
            $url = "https://example.com";
            $html = file_get_contents($url);
        break;

        case "select":
            libxml_use_internal_errors(true);
            $dom = new DOMDocument();
            $dom->loadHTML($html);
            $xpath = new DOMXPath($dom);

            $nodes = $xpath->query("//h1"); // ejemplo
        break;

        case "text":
            if (isset($nodes[0])) {
                $result = $nodes[0]->textContent;
            }
        break;

        case "attr":
            if (isset($nodes[0])) {
                $result = $nodes[0]->getAttribute("href");
            }
        break;

        case "output":
            // nada extra
        break;
    }
}

echo json_encode([
    "result" => $result
]);
