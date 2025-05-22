<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, OPTIONS');
	header('Access-Control-Allow-Headers: Content-Type');
	header('Content-Type: application/json');
//require_once './find_service.php';
function startService($service) {
	return shell_exec("sc start \"$service\"");
}

function stopService($service) {
	return shell_exec("sc stop \"$service\"");
}

date_default_timezone_set('America/Mexico_City');

function printLog($path,$title, $message){
	if(file_exists($path)){
		file_put_contents(
			$path,
			$title . ' : ' . $message . "\n",
			FILE_APPEND
		);
	}
}

$start = './logs/start_service.log';
$stop = './logs/stop_service.log';
$restart = './logs/restart_service.log';

$time = date('Y-m-d H:i:s');


if($_SERVER['REQUEST_METHOD'] == 'POST') {
	$data = json_decode(file_get_contents('php://input'), true);
	$action = $data['action'] ?? null;

	if(!$action){
		echo json_encode([
			'status' => false,
			'message' => 'No action specified'
		]);
		printLog(
			'./logs/logs.log',
			'['. date('H:i:s') . '] -' .'Petion but failed',
			'No action specified'
		);
		return;
	}

	$service = 'basculaspesaje.exe';

	// the log of every action
	printLog(
		'./logs/logs.log',
		'['. date('H:i:s') . '] -' .'Petion in line',
		'Action: '. $action

	);

	// this will start the service and print the log
	// into tje file start_service.log
	if ($action == 'start') {
		$output = startService($service);

		printLog(
			$start,
			'[' . $time . '] - Starting, Service',
			$output
		);

	// this will fully stop the service and print the log
	// into tje file stop_service.log
	} elseif ($action == 'stop') {
		$output = stopService($service);
		printLog(
			$stop,
			'[' . $time . '] - Stopping, Service',
			$output
		);
	}

	// this will stop and hold 5 seconds and then
	//start the service again also print the log
	// into tje file start_service.log
	elseif ($action == 'restart') {
		$stop = stopService($service);
		printLog(
			$restart,
			'[' . $time . '] - Restarting, Service',
			$stop
		);
		sleep(2);
		$start = startService($service);
		printLog(
			$restart,
			'['. date('H:i:s') . '] -' .'Server in line!',
			$start
		);
	}
	echo json_encode([
		'status' => true,
		'message' => 'Action completed successfully'
	]);


} else {
	echo json_encode([
		'status' => false,
		'message' => 'No action specified'
	]);
	printLog(
		'./logs/logs.log',
		'['. date('H:i:s') . '] -' .'Petion but failed',
		'No action specified'
	);
}