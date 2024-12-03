<?php
session_start();
header('Content-Type: application/json');

   
class Klarna {
    private $base_url = "https://api.playground.klarna.com";
    private $uid = "PK257168_7b0dfd86deb3";
    private $pass = "0QE4yj4AUEZ0b6Xe";

    function createSession($order) {
        $url = $this->base_url . "/payments/v1/sessions";

    $data_tesr = [
        'purchase_country' => 'SE',
        'purchase_currency' => 'SEK',
        'locale' => 'sv-SE',
        'order_amount' => 10000,
        'order_lines' => [
            [
                'type' => 'physical',
                'reference' => '123050',
                'name' => 'Svart T-shirt',
                'quantity' => 5,
                'quantity_unit' => 'pcs',
                'unit_price' => 2000,
                'total_amount' => 10000,
            ]
        ]
    ];

        //echo $data_tesr;
        $payload = json_encode($data_tesr);
        //echo $payload;
        //exit;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode("{$this->uid}:{$this->pass}")
        ]);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

        $response = curl_exec($ch);
        curl_close($ch);

        if ($response === false) {
            echo "cURL error: " . curl_error($ch);
            return false;
        } else {
            
           //echo $response; 
            return ($response);
        }
    }
}

// Använder klassen
$klarna = new Klarna();
$result = $klarna->createSession(new stdClass()); 
echo ($result);

?>


