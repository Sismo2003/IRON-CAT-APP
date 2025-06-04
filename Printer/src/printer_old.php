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



$data = file_get_contents('php://input');
$decoded = json_decode($data, true);
$items = is_array($decoded) ? (isset($decoded['cart']) ? $decoded['cart'] : $decoded) : [];

$error_log = './logs/error.log';
$log = './logs/printer.log';


function fetchApiData(string $url): array {
	$ch = curl_init($url);
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT        => 10,
		CURLOPT_FAILONERROR    => false,
	]);

	$raw = curl_exec($ch);
	$errno = curl_errno($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);

	if ($errno) {
		throw new Exception('cURL error: ' . curl_strerror($errno));
	}
	if ($httpCode < 200 || $httpCode >= 300) {
		throw new Exception("HTTP error: código $httpCode");
	}

	$data = json_decode($raw, true);
	if (json_last_error() !== JSON_ERROR_NONE) {
		throw new Exception('Error al decodificar JSON: ' . json_last_error_msg());
	}

	$id = $data['id'] ?? null;
	return $data;
}


function printLog($path,$title, $message){
  if(file_exists($path)){
    file_put_contents(
      $path,
      $title . ' : ' . $message . "\n",
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
	printLog(
		$log,
		"[PRINTER JOB RECIBER] - [".date('Y-m-d H:i:s')."]",
		"Printer job received"
	);
	// getinf information from the ticket
	if(isset($decoded['ticket_id']) && !empty($decoded['ticket_id'])) {
		printLog(
			$log,
			"[FETCHING FOR TICKET INFORMATION] - [".date('Y-m-d H:i:s')."]",
			"Fetching data using ID for the ticket: " . $decoded['ticket_id']
		);

		$apiUrl = $_ENV['API_URL'] . '/tickets/get-ticket?id=' . $decoded['ticket_id'];

		$ticketFetched   = fetchApiData($apiUrl)['data'];

		// fechas de generacion de ticket
		$fecha = new DateTime($ticketFetched['ticket'][0]['date']);
		$formatted = $fecha->format("d/m/Y H:i");

		$ticketFetched['ticket'][0]['date'] = $formatted;

		// status de venta
		if($ticketFetched['ticket'][0]['status'] == 'pending') {
			$ticketFetched['ticket'][0]['status'] = 'Pendiente';
		} else if ($ticketFetched['ticket'][0]['status'] == 'deleted') {
			$ticketFetched['ticket'][0]['status'] = 'Borrado';
		}else{
			$ticketFetched['ticket'][0]['status'] = 'Autorizado';
		}

		if($ticketFetched['ticket'][0]['type'] == 'sale') {
			$ticketFetched['ticket'][0]['type'] = 'Venta';
		} else {
			$ticketFetched['ticket'][0]['type'] = 'Compra';
		}

        if($ticketFetched['products_ticket'][0]['type'] == 'wholesale') {
            $tipo_venta = 'Mayoreo';
        }else{
            $tipo_venta = 'Menudeo';
        }

		printLog(
			$log,
			"[TICEKT DATA] - [".date('Y-m-d H:i:s')."] - ",// .  json_encode($ticketFetched['products_ticket'][0]),
			"Ticket data fetched"
		);

//		printLog(
//			$log,
//			"[TICEKT DATA] - [".date('Y-m-d H:i:s')."] - cart ",// .  json_encode($ticketFetched['products_ticket'][0]),
//			json_encode($ticketFetched['products_ticket'][0])
//			$ticketFetched['products_ticket'][0]
//		);

//		return 0;
	}


  $printer_name = 'POS-80C';

	// Load a valid ESC/POS capability profile
	$profile = CapabilityProfile::load('default');
	
	$connector = new WindowsPrintConnector($printer_name);
	$printer = new Printer($connector, $profile);



  printLog(
    $log,
    "[PRINTER CONNETECTED] - [".date('Y-m-d H:i:s')."]",
    "Conected to " . $printer_name
  );




  // -- Encabezado del ticket --
//	 Imprimir logo en encabezado
//	$logoPath = __DIR__ . '/logo.pbm';

//	$logo = EscposImage::load(__DIR__.'/logo_mono.jpg', true);
//	$printer->setJustification(Printer::JUSTIFY_CENTER);
//	$printer->bitImageColumnFormat($logo);
//
////		$printer->setJustification(Printer::JUSTIFY_CENTER);
////	if (file_exists($logoPath)) {
////
////		$printer -> graphics($logo);
////
////
////		$printer->feed(1);
////	}



// Centrar y escalar al 2×
$printer->setJustification(Printer::JUSTIFY_CENTER);
$printer->setTextSize(3,3);        // Ancho ×2, Alto ×2
$printer->setEmphasis(true);
$printer->text("IRON CAT\n");

// $logopath = __DIR__ . '/logo-dark.png';
// $logo = EscposImage::load($logopath, false);
// $printer->setJustification(Printer::JUSTIFY_CENTER);
// $printer->bitImage($logo);


$printer->setTextSize(2, 2);
$printer->text("RECYCLING CENTER\n");
$printer->setEmphasis(false);
// Reducir a Fuente B también centrada, pero normal tamaño
$printer->selectPrintMode(Printer::MODE_FONT_B);
$printer->setTextSize(1, 1);        // Vuelve a tamaño normal
$printer->text("C. Ignacio Bernal 3030,\nRancho Nuevo, 44240 Guadalajara, Jal.\n");
$printer->text("+52 33 3813 5688\n");

// Y por si quieres volver a la fuente A habitual:
$printer->selectPrintMode(Printer::MODE_FONT_A);

	$printer->feed(2);

  // -- Datos principales --
  $printer->setJustification(Printer::JUSTIFY_LEFT);
  // NOMBRE DEL USUARIO QUE GENERA EL TICKET
  if(isset($decoded['user_name']) && !empty($decoded['user_name'])) {
    $printer->text("ENCARGADO: " . $decoded['user_name'] . "\n");
  } else {
    $printer->text("ENCARGADO: No disponible\n");
  }

	// FECHA Y HORA DE GENERACION DEL TICKET
	if(isset($ticketFetched['ticket'][0]) && !empty($ticketFetched['ticket'][0])) {
		// Fecha de generacion de ticket
		if(!empty($ticketFetched['ticket'][0]['date'])) {
			$printer->text("FECHA: " . $ticketFetched['ticket'][0]['date'] . "\n");
		}
		// ESTADO DEL TICKET
		if(!empty($ticketFetched['ticket'][0]['status'])) {
			$printer->text("ESTADO: " . $ticketFetched['ticket'][0]['status']  . "\n");
		}
		// FOLIO DE TICKET
		if(!empty($ticketFetched['ticket'][0]['id'])) {
			$printer->text("FOLIO: " . $ticketFetched['ticket'][0]['id']  . "\n");
		}
		// TIPO DE VENTA
		if(!empty($ticketFetched['ticket'][0]['type'])) {
			$printer->text("TIPO DE TRANSACCION: " .$ticketFetched['ticket'][0]['type'] . "\n");
		}

        // TIPO DE VENTA
        if(!empty($tipo_venta)) {
            $printer->text("TIPO DE VENTA: " .$tipo_venta . "\n");
        }

		// PLACA DE VEHICULO
		if(!empty($ticketFetched['ticket'][0]['vehicle_plate'])) {
			$printer->text("PLACA DEL VEHICULO: " . $ticketFetched['ticket'][0]['vehicle_plate']  . "\n");
		}
		// MODELO DE VEHICULO
		if(!empty($ticketFetched['ticket'][0]['vehicle_model'])) {
			$printer->text("MODELO DE VEHICULO: " .$ticketFetched['ticket'][0]['vehicle_model'] . "\n");
		}
		

	}


	// -- INFORMACION DEL CLIENTE --
//
	//	// NOMBRE DEL CLIENTE (sin registrar o registrado)
	if (isset($decoded['customer_name']) && !empty($decoded['customer_name'])) {
		// Convertir a mayúsculas respetando UTF-8
		$nombreMayus = mb_strtoupper($decoded['customer_name'], 'UTF-8');
		$printer->text("CLIENTE: " . $nombreMayus . "\n");
	}


	if(isset($ticketFetched['client'][0]) && !empty($ticketFetched['client'][0])) {
		// NOMBRE DE CLIENTE REGISTRADO
		//if(!empty($ticketFetched['client'][0]['name'])) {
		//	$name = $ticketFetched['client'][0]['name'];
		//	if(!empty($ticketFetched['client'][0]['last_name'])) {
		//		$name .= ' ' . $ticketFetched['client'][0]['last_name'];
		//	}
		//	$printer->text("CLIENTE: " . $name . "\n");
		//}
		//NUMERO DE CLIENTE
		if(!empty($ticketFetched['client'][0]['customer_id'])) {
			$printer->text("NUM. DE CLIENTE: " . $ticketFetched['client'][0]['customer_id'] . "\n");
		}
		//rfc en caso que exista
		if(!empty($ticketFetched['client'][0]['rfc']) && $ticketFetched['client'][0]['rfc'] != null) {
			$printer->text("RFC: " . $ticketFetched['client'][0]['rfc'] . "\n");
		}
		//correo electronico
		if(!empty($ticketFetched['client'][0]['email'])  ) {
			$printer->text("CORREO ELECTRONICO: " . $ticketFetched['client'][0]['email'] . "\n");
		}
		// telefono
		if(!empty($ticketFetched['client'][0]['phone'])  ) {
			$printer->text("TELEFONO: " . $ticketFetched['client'][0]['phone'] . "\n");
		}
		//ULTIMA VISITA
		if(!empty($ticketFetched['client'][0]['last_visit'])){
			$printer->text("ULTIMA VISITA: " . $ticketFetched['client'][0]['last_visit'] . "\n");
		}

		if(!empty($ticketFetched['client'][0]['address'])){
			$printer->text("DIRECCION: " . $ticketFetched['client'][0]['address'] . "\n");
		}

		if(!empty($ticketFetched['client'][0]['deleted'])) {
			$printer->text("ESTADO: " . ($ticketFetched['client'][0]['deleted'] == 1 ? 'INACTIVO' : 'ACTIVO') . "\n");
		}
	}

	$printer->feed(1);
  $printer->text("------------------------------------------------\n");
	// Switch to a smaller font and tighten line spacing
	$printer->setLineSpacing(20);
	$printer->selectPrintMode(Printer::MODE_FONT_B);
	// -- Tabla de productos --
  // Table header with additional “MRM” (merma) column, using abbreviations to keep width
  $printer->text("PRODUCTO                 PESO     MRM      PRECIO    TOTAL\n");
	$printer->selectPrintMode(Printer::MODE_FONT_A);
  $printer->text("------------------------------------------------\n");
	//$printer->selectPrintMode(Printer::MODE_FONT_B);

  $precioFinal = 0;
  $numItems = 0;
  $totalKg = 0;
  $merma = 0;
  foreach ($ticketFetched['products_ticket'] as $item) {
    // Nombre del producto: trim a 24 chars, pad right
    $productField = str_pad(mb_strimwidth($item['material'], 0, 15, ''), 15, ' ', STR_PAD_RIGHT);

    // Peso: trim a 6 chars, pad left
    $weightField  = str_pad(mb_strimwidth($item['weight'], 0, 6, ''), 6, ' ', STR_PAD_LEFT);

    // Merma: trim a 6 chars, pad left
    $wasteField   = str_pad(mb_strimwidth((string)$item['waste'], 0, 5, ''), 5, ' ', STR_PAD_LEFT);

    // Precio unitario: formatear, trim a 10 chars, pad left
    $unitText     = '$' . number_format($item['unit_price'], 2);
    $unitField    = str_pad(mb_strimwidth($unitText, 0, 10, ''), 10, ' ', STR_PAD_LEFT);

    // Precio total: formatear, trim a 10 chars, pad left
    $totalText    = '$' . number_format($item['total'], 2);
    $totalField   = str_pad(mb_strimwidth($totalText, 0, 7, ''), 7, ' ', STR_PAD_LEFT);

    // Concatenar TODO en una sola línea para evitar saltos intermedios
    $line = "{$productField} {$weightField} {$wasteField} {$unitField} {$totalField}\n";

    // Actualizar totales...
    $numItems++;
    $totalKg     += $item['weight'];
    $merma       += $item['waste'];
    $precioFinal += $item['total'];

    // Imprimir la línea completa
    $printer->text($line);
}


  $printer->selectPrintMode(Printer::MODE_FONT_A);
  $printer->setLineSpacing(); // reset to default
	$printer->text("------------------------------------------------\n");
  $printer->feed(1);

	// Revert to standard font for totals
  $printer->setJustification(Printer::JUSTIFY_LEFT);
  // -- Totales --
  $printer->text(number_format($totalKg,2) . " KG\n");

  	$entero    = floor($precioFinal);
	$decimal   = $precioFinal - $entero;

	// 2) Aplica el umbral de 0.50
	if ($decimal > 0.50) {
		$redondeado = ceil($precioFinal);
	} else {
		$redondeado = floor($precioFinal);
	}

  
  $printer->text("IMPORTE TOTAL: \$". number_format($redondeado,2) ."\n");



  $operationId = $ticketFetched['ticket'][0]['id'];

  // Espacio extra antes del código de barras
  $printer->feed(1);
  // Centrar y configurar código de barras
  $printer->setJustification(Printer::JUSTIFY_CENTER);
  $printer->setBarcodeHeight(70);
  $printer->setBarcodeTextPosition(Printer::BARCODE_TEXT_BELOW);
  $printer->setBarcodeWidth(5);
  // Usar Code128 set C para datos numéricos
  $barcodeData = '{A' . $operationId;
  $printer->barcode($barcodeData, Printer::BARCODE_CODE128);
  $printer->feed(1);


  $printer->cut();
  $printer->close();

  printLog(
    $log,
    "[PRINTING JOB FINISHING] - [".date('Y-m-d H:i:s')."]",
    "Printer already print successfully"
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