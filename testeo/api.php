<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$blocks = $data["blocks"];
$connections = $data["connections"];

$html = "";
$result = "";
$nodes = [];

libxml_use_internal_errors(true);

foreach ($connections as $c) {

    foreach ($blocks as $b) {
        if ($b["id"] === $c["from"]) {

            switch ($b["type"]) {

                case "url":
                    $html = file_get_contents($b["config"]);
                break;

                case "select":
                    $dom = new DOMDocument();
                    $dom->loadHTML($html);
                    $xpath = new DOMXPath($dom);

                    $nodes = $xpath->query("//" . $b["config"]);
                break;

                case "text":
                    if ($nodes->length > 0) {
                        $result = $nodes[0]->textContent;
                    }
                break;

                case "attr":
                    if ($nodes->length > 0) {
                        $result = $nodes[0]->getAttribute($b["config"]);
                    }
                break;

                case "output":
                    // nada
                break;
            }

        }
    }
}

echo json_encode([
    "result" => $result
]);