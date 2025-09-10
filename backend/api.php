<?php
require_once 'config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'restaurants':
        getRestaurants();
        break;
    case 'orders':
        getOrders();
        break;
    case 'analytics':
        getAnalytics();
        break;
    case 'top-restaurants':
        getTopRestaurants();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

function getRestaurants() {
    global $restaurants;
    
    // Filtering
    if (isset($_GET['search'])) {
        $search = strtolower($_GET['search']);
        $filtered = array_filter($restaurants, function($r) use ($search) {
            return strpos(strtolower($r['name']), $search) !== false || 
                   strpos(strtolower($r['location']), $search) !== false ||
                   strpos(strtolower($r['cuisine']), $search) !== false;
        });
        echo json_encode(array_values($filtered));
        return;
    }
    
    // Sorting
    if (isset($_GET['sort'])) {
        $sortBy = $_GET['sort'];
        usort($restaurants, function($a, $b) use ($sortBy) {
            return $a[$sortBy] <=> $b[$sortBy];
        });
    }
    
    echo json_encode($restaurants);
}

function getOrders() {
    global $orders;
    $filteredOrders = $orders;
    
    // Apply filters
    if (isset($_GET['restaurant_id'])) {
        $restaurantId = intval($_GET['restaurant_id']);
        $filteredOrders = array_filter($filteredOrders, function($o) use ($restaurantId) {
            return $o['restaurant_id'] === $restaurantId;
        });
    }
    
    if (isset($_GET['start_date']) && isset($_GET['end_date'])) {
        $start = strtotime($_GET['start_date']);
        $end = strtotime($_GET['end_date']) + 86400; // Include end date
        
        $filteredOrders = array_filter($filteredOrders, function($o) use ($start, $end) {
            $orderTime = strtotime($o['order_time']);
            return $orderTime >= $start && $orderTime < $end;
        });
    }
    
    if (isset($_GET['min_amount'])) {
        $min = floatval($_GET['min_amount']);
        $filteredOrders = array_filter($filteredOrders, function($o) use ($min) {
            return $o['order_amount'] >= $min;
        });
    }
    
    if (isset($_GET['max_amount'])) {
        $max = floatval($_GET['max_amount']);
        $filteredOrders = array_filter($filteredOrders, function($o) use ($max) {
            return $o['order_amount'] <= $max;
        });
    }
    
    if (isset($_GET['hour_range'])) {
        $hours = explode(',', $_GET['hour_range']);
        $startHour = intval($hours[0]);
        $endHour = intval($hours[1]);
        
        $filteredOrders = array_filter($filteredOrders, function($o) use ($startHour, $endHour) {
            $orderHour = intval(date('H', strtotime($o['order_time'])));
            return $orderHour >= $startHour && $orderHour <= $endHour;
        });
    }
    
    echo json_encode(array_values($filteredOrders));
}

function getAnalytics() {
    global $orders, $restaurants;
    
    $restaurantId = isset($_GET['restaurant_id']) ? intval($_GET['restaurant_id']) : null;
    $startDate = isset($_GET['start_date']) ? $_GET['start_date'] : date('Y-m-d', strtotime('-7 days'));
    $endDate = isset($_GET['end_date']) ? $_GET['end_date'] : date('Y-m-d');
    
    // Filter orders by restaurant and date range
    $filteredOrders = array_filter($orders, function($o) use ($restaurantId, $startDate, $endDate) {
        $orderDate = date('Y-m-d', strtotime($o['order_time']));
        $matchesRestaurant = $restaurantId ? $o['restaurant_id'] === $restaurantId : true;
        $inDateRange = $orderDate >= $startDate && $orderDate <= $endDate;
        return $matchesRestaurant && $inDateRange;
    });
    
    // Group orders by date
    $ordersByDate = [];
    foreach ($filteredOrders as $order) {
        $date = date('Y-m-d', strtotime($order['order_time']));
        if (!isset($ordersByDate[$date])) {
            $ordersByDate[$date] = [
                'orders' => [],
                'total_revenue' => 0,
                'order_count' => 0,
                'hours' => []
            ];
        }
        
        $ordersByDate[$date]['orders'][] = $order;
        $ordersByDate[$date]['total_revenue'] += $order['order_amount'];
        $ordersByDate[$date]['order_count']++;
        
        $hour = date('H', strtotime($order['order_time']));
        if (!isset($ordersByDate[$date]['hours'][$hour])) {
            $ordersByDate[$date]['hours'][$hour] = 0;
        }
        $ordersByDate[$date]['hours'][$hour]++;
    }
    
    // Calculate analytics
    $analytics = [];
    foreach ($ordersByDate as $date => $data) {
        $peakHour = array_keys($data['hours'], max($data['hours']))[0];
        $avgOrderValue = $data['order_count'] > 0 ? $data['total_revenue'] / $data['order_count'] : 0;
        
        $analytics[$date] = [
            'date' => $date,
            'order_count' => $data['order_count'],
            'total_revenue' => $data['total_revenue'],
            'avg_order_value' => round($avgOrderValue, 2),
            'peak_hour' => $peakHour . ':00'
        ];
    }
    
    // Fill in missing dates with zero values
    $period = new DatePeriod(
        new DateTime($startDate),
        new DateInterval('P1D'),
        new DateTime($endDate . ' +1 day')
    );
    
    $completeAnalytics = [];
    foreach ($period as $date) {
        $dateStr = $date->format('Y-m-d');
        if (isset($analytics[$dateStr])) {
            $completeAnalytics[] = $analytics[$dateStr];
        } else {
            $completeAnalytics[] = [
                'date' => $dateStr,
                'order_count' => 0,
                'total_revenue' => 0,
                'avg_order_value' => 0,
                'peak_hour' => 'N/A'
            ];
        }
    }
    
    echo json_encode($completeAnalytics);
}

function getTopRestaurants() {
    global $orders, $restaurants;
    
    $startDate = isset($_GET['start_date']) ? $_GET['start_date'] : date('Y-m-d', strtotime('-7 days'));
    $endDate = isset($_GET['end_date']) ? $_GET['end_date'] : date('Y-m-d');
    
    // Filter orders by date range
    $filteredOrders = array_filter($orders, function($o) use ($startDate, $endDate) {
        $orderDate = date('Y-m-d', strtotime($o['order_time']));
        return $orderDate >= $startDate && $orderDate <= $endDate;
    });
    
    // Calculate revenue by restaurant
    $revenueByRestaurant = [];
    foreach ($filteredOrders as $order) {
        $restaurantId = $order['restaurant_id'];
        if (!isset($revenueByRestaurant[$restaurantId])) {
            $revenueByRestaurant[$restaurantId] = 0;
        }
        $revenueByRestaurant[$restaurantId] += $order['order_amount'];
    }
    
    // Sort by revenue descending
    arsort($revenueByRestaurant);
    
    // Get top 3
    $topRestaurants = [];
    $count = 0;
    foreach ($revenueByRestaurant as $restaurantId => $revenue) {
        if ($count >= 3) break;
        
        $restaurant = array_filter($restaurants, function($r) use ($restaurantId) {
            return $r['id'] === $restaurantId;
        });
        
        if (!empty($restaurant)) {
            $restaurant = array_values($restaurant)[0];
            $topRestaurants[] = [
                'id' => $restaurantId,
                'name' => $restaurant['name'],
                'revenue' => $revenue
            ];
            $count++;
        }
    }
    
    echo json_encode($topRestaurants);
}