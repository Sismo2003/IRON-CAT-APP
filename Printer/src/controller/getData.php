<?php
	require_once __DIR__ . '/../../vendor/autoload.php';
	use Dotenv\Dotenv;

	$dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
	$dotenv->load();

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
		return ['response' => $data, 'id' => $id];
	}

	try {


		$apiUrl = $_ENV['API_URL'] . '/'. $router . '?id=' . $id;
		$result   = fetchApiData($apiUrl);

		echo json_encode($result);


	} catch (Exception $e) {
		$errorMessage = $e->getMessage();
		echo json_encode([
			'status' => 'error',
			'message' => $errorMessage,
		]);

	}