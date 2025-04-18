<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require '../vendor/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\CupsPrintConnector;


$data = file_get_contents('php://input');
$decoded = json_decode($data, true);
$items = is_array($decoded) ? (isset($decoded['cart']) ? $decoded['cart'] : $decoded) : [];

$error_log = './logs/error.log';
$log = './logs/printer.log';




function printLog($path,$title, $message){
  if(file_exists($path)){
    file_put_contents(
      $path,
      $title . ' : ' . $message,
      FILE_APPEND
    );
  }
}

if(empty($items)) {
  if(file_exists($error_log)){
    file_put_contents(
      $error_log,
      "[ERROR][".date('Y-m-d H:i:s')."] - Intento de impresión, fallido debido a falta de parametros.\n",
      FILE_APPEND
    );
  }
  
  return json_encode([
      'status' => 'error',
      'message' => 'No se han encontrado productos en el carrito.'
  ]);
}

try {

  $printer_name = 'GHIA_GTP801';

  $connector = new CupsPrintConnector($printer_name);
  $printer = new Printer($connector);

  printLog(
    $log,
    "[PRINTER JOB RECIBER] - [".date('Y-m-d H:i:s')."]",
    "Conected to " . $printer_name
  );
   
  

  // -- Encabezado del ticket --
  $printer->setEmphasis(true);
  $printer->setJustification(Printer::JUSTIFY_CENTER);
  $printer->setEmphasis(true);
  $printer->text("TICKET DE VENTA \n");
  $printer->text("IRON CAT RECICLADORA \n");
  $printer->setEmphasis(false);
  $printer->feed(2);

  // -- Datos principales --
  $printer->setEmphasis(true);
  $printer->setJustification(Printer::JUSTIFY_LEFT);
  $printer->text("ENCARGADO: Virgen\n");
  $printer->text("Cliente: Luis Maravilla\n");
  $printer->text("ID: A012323392982\n");
  $printer->text("Estado: Pendiente\n");
  $printer->text("---------------------------------------------\n");

  // -- Tabla de productos --
  // Cabecera
  $printer->setEmphasis(true);
  $printer->setJustification(Printer::JUSTIFY_CENTER);
  $printer->text("ID  PRODUCTO            PESO   PRECIO   TOTAL\n");
  $printer->setEmphasis(false);

  $precioFinal = 0;
  $numItems = 0;
  $totalKg = 0;
  $merma = 0;

  foreach ($items as $item) {
      $line = sprintf(
          "%-3s %-20s %-4s %-8s %s\n",
          $numItems,
          $item['material'],
          $item['weight'] . 'Kg',
          '$'. number_format($item['price'],2),
          '$' . number_format($item['total'],2)
      );
      $numItems++;
      $totalKg += $item['weight'];
      $precioFinal += $item['total'];
      $printer->text($line);
  }

  $printer->text("---------------------------------------------\n");

  $printer->feed(2);
  $printer->setEmphasis(true);
  $printer->setJustification(Printer::JUSTIFY_LEFT);

  // -- Totales --
  $printer->text("CANTIDAD TOTAL (KG): ". number_format($totalKg,2) . "\n");
  $printer->text("CANTIDAD TOTAL MERMA: ". number_format($merma,2) ."KG\n");
  $printer->text("IMPORTE TOTAL: \$". number_format($precioFinal,2) ."\n");
  $printer->text("Operación: A012323392982\n");

  // Espacio extra y corte
  $printer->feed(3);

  $printer->setEmphasis(true);
  $printer->setJustification(Printer::JUSTIFY_CENTER);
  $a = "{A012323392982";

  $printer -> setBarcodeHeight(70);
  $printer->setBarcodeTextPosition(Printer::BARCODE_TEXT_BELOW);
  $printer->setBarcodeWidth(5);
  foreach(array($a) as $item)  {
      $printer -> barcode($item, Printer::BARCODE_CODE128);
      $printer -> feed(2);
  }


  $printer->cut();
  $printer->close();

  printLog(
    $$log,
    "[PRINTING JOB FINISHING] - [".date('Y-m-d H:i:s')."]",
    "Printer alredy print succesfully"
  );

  return json_encode([
      'status' => 'success',
      'message' => 'Ticket de venta generado correctamente.'
  ]);


} catch (Exception $e) {


  printLog(
    $error_log,
    "[ERROR] - [".date('Y-m-d H:i:s')."]",
    "Error unexpected during printing : [". $e . "]"
  );
  
  return json_encode([
      'status' => 'error',
      'message' => 'Error al generar el ticket de venta.',
      'error' => $e->getMessage()
  ]);
}