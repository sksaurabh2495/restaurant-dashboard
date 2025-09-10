<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Simulate database with JSON files
$restaurants = json_decode(file_get_contents('restaurants.json'), true);
$orders = json_decode(file_get_contents('orders.json'), true);