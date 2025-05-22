<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
date_default_timezone_set('America/Mexico_City');
require '../vendor/autoload.php';

use Mike42\Escpos\Printer;
//use Mike42\Escpos\PrintConnectors\CupsPrintConnector;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\CapabilityProfile;

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$logopath = __DIR__ . '/logo-dark.png';

if(!file_exists($logopath)) {
    return json_encode([
    "status" => "error",
    "message" => "No se encontró la imagen del logo."
    ]);
    exit;
}
$logo = EscposImage::load($logopath, false);


try {

  $printer_name = 'POS-80C';

	// Load a valid ESC/POS capability profile
	$profile = CapabilityProfile::load('default');
	
	$connector = new WindowsPrintConnector($printer_name);
	$printer = new Printer($connector, $profile);

    $printer->setJustification(Printer::JUSTIFY_CENTER);
    $printer->bitImageColumnFormat($logo);


    $printer->close();

  return json_encode([
      'status' => 'success',
      'message' => 'Ticket de venta generado correctamente.'
  ]);


} catch (Exception $e) {

  
  return json_encode([
      'status' => 'error',
      'message' => 'Error al generar el ticket de venta.',
      'error' => $e->getMessage()
  ]);
}