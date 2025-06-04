<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
date_default_timezone_set('America/Mexico_City');
require '../vendor/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
//use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\CapabilityProfile;

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$logopath = __DIR__ . '/logo-dark-mini.png';

if(!file_exists($logopath)) {
    return json_encode([
    "status" => "error",
    "message" => "No se encontró la imagen del logo."
    ]);
    exit;
}

$logo = EscposImage::load($logopath, false);

if (!$logo) {
		return json_encode([
				"status" => "error",
				"message" => "Error al cargar la imagen del logo."
		]);
		exit;
}
try {

	//  $printer_name = 'POS-80C';
	  $printer_name = 'POS80';

		// Load a valid ESC/POS capability profile
		$profile = CapabilityProfile::load('default');
	
	//$connector = new WindowsPrintConnector($printer_name);
		$connector = new CupsPrintConnector($printer_name);
		$printer = new Printer($connector,$profile);

		$printer->initialize();

    $printer->setJustification(Printer::JUSTIFY_CENTER);
    $printer->bitImage($logo);
	$printer->text("Hola Mundo\n");
	$printer->feed(2);
	$printer->cut();
    $printer->close();

  echo json_encode([
      'status' => 'success',
      'message' => 'Ticket de venta generado correctamente.'
  ]);

} catch (Exception $e) {


	echo json_encode([
      'status' => 'error',
      'message' => 'Error al generar el ticket de venta.',
      'error' => $e->getMessage()
  ]);
}