<?php
/**
 * Contact Form Submission Handler
 * Handles AJAX POST requests from the contact form
 */

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Include configuration
require_once 'config.php';

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['nombre', 'email', 'asunto', 'mensaje', 'recaptcha_token'];
foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
        exit;
    }
}

// Sanitize input data
$nombre = htmlspecialchars(trim($input['nombre']), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$telefono = isset($input['telefono']) ? htmlspecialchars(trim($input['telefono']), ENT_QUOTES, 'UTF-8') : '';
$asunto = htmlspecialchars(trim($input['asunto']), ENT_QUOTES, 'UTF-8');
$mensaje = htmlspecialchars(trim($input['mensaje']), ENT_QUOTES, 'UTF-8');
$recaptcha_token = trim($input['recaptcha_token']);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

// Verify reCAPTCHA
$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
$recaptcha_data = [
    'secret' => RECAPTCHA_SECRET_KEY,
    'response' => $recaptcha_token,
    'remoteip' => $_SERVER['REMOTE_ADDR']
];

$recaptcha_options = [
    'http' => [
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($recaptcha_data)
    ]
];

$recaptcha_context = stream_context_create($recaptcha_options);
$recaptcha_result = file_get_contents($recaptcha_url, false, $recaptcha_context);
$recaptcha_json = json_decode($recaptcha_result);

if (!$recaptcha_json->success || $recaptcha_json->score < 0.5) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Verificación de seguridad fallida']);
    exit;
}

// Get client IP address
$ip_address = $_SERVER['REMOTE_ADDR'];
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
} elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip_address = $_SERVER['HTTP_CLIENT_IP'];
}

// Connect to database
$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if (!$conn) {
    error_log('Database connection failed: ' . mysqli_connect_error());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al procesar la solicitud']);
    exit;
}

// Set charset
mysqli_set_charset($conn, 'utf8mb4');

// Prepare SQL statement
$stmt = mysqli_prepare($conn, 
    "INSERT INTO contact_messages (nombre, email, telefono, asunto, mensaje, ip_address, is_read, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, 0, NOW())"
);

if (!$stmt) {
    error_log('Prepare statement failed: ' . mysqli_error($conn));
    mysqli_close($conn);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al procesar la solicitud']);
    exit;
}

// Bind parameters
mysqli_stmt_bind_param($stmt, 'ssssss', $nombre, $email, $telefono, $asunto, $mensaje, $ip_address);

// Execute statement
if (!mysqli_stmt_execute($stmt)) {
    error_log('Execute statement failed: ' . mysqli_stmt_error($stmt));
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al guardar el mensaje']);
    exit;
}

// Get inserted ID
$message_id = mysqli_insert_id($conn);

// Close statement and connection
mysqli_stmt_close($stmt);
mysqli_close($conn);

// Send email notification
$email_subject = "Nuevo mensaje de contacto: " . $asunto;
$email_body = "Has recibido un nuevo mensaje desde el formulario de contacto.\n\n";
$email_body .= "Nombre: " . $nombre . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Teléfono: " . ($telefono ?: 'No proporcionado') . "\n";
$email_body .= "Asunto: " . $asunto . "\n";
$email_body .= "Mensaje:\n" . $mensaje . "\n\n";
$email_body .= "IP: " . $ip_address . "\n";
$email_body .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
$email_body .= "ID: #" . $message_id . "\n";

$email_headers = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
$email_headers .= "Reply-To: " . $email . "\r\n";
$email_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$email_sent = mail(NOTIFICATION_EMAIL, $email_subject, $email_body, $email_headers);

if (!$email_sent) {
    error_log('Failed to send email notification for message ID: ' . $message_id);
}

// Return success response
http_response_code(200);
echo json_encode([
    'success' => true, 
    'message' => '¡Gracias por contactarnos! Te responderemos pronto.',
    'id' => $message_id
]);

/*
 * DATABASE TABLE STRUCTURE:
 * 
 * Run the following SQL to create the required table:
 * 
 * CREATE TABLE contact_messages (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     nombre VARCHAR(255) NOT NULL,
 *     email VARCHAR(255) NOT NULL,
 *     telefono VARCHAR(50),
 *     asunto VARCHAR(255) NOT NULL,
 *     mensaje TEXT NOT NULL,
 *     ip_address VARCHAR(45) NOT NULL,
 *     is_read TINYINT(1) DEFAULT 0,
 *     created_at DATETIME NOT NULL,
 *     INDEX idx_created_at (created_at),
 *     INDEX idx_is_read (is_read),
 *     INDEX idx_email (email)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
