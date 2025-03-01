<?php
// Set headers to prevent caching
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Log function for debugging
function logMessage($message) {
    $log_file = 'form_submissions.log';
    $log_entry = date('Y-m-d H:i:s') . " - " . $message . "\n";
    file_put_contents($log_file, $log_entry, FILE_APPEND);
}

// Log the request method
logMessage("Request method: " . $_SERVER['REQUEST_METHOD']);

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    logMessage("Error: Method not allowed");
    exit;
}

// Get form data
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

// Log received data
logMessage("Received form data - Name: $name, Email: $email");

// Validate form data
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields']);
    logMessage("Error: Missing required fields");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    logMessage("Error: Invalid email format");
    exit;
}

// Set up email
$to = 'abde8473@stthomas.edu';
$subject = 'New Contact Form Submission from ' . $name;
$email_content = "Name: $name\n";
$email_content .= "Email: $email\n\n";
$email_content .= "Message:\n$message\n";

// Set email headers
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Attempt to send email
logMessage("Attempting to send email to $to");
$mail_sent = mail($to, $subject, $email_content, $headers);

// Log the result
if ($mail_sent) {
    logMessage("Email sent successfully");
} else {
    logMessage("Failed to send email. PHP mail() function returned false");
}

// Always save the message to the log file as a backup
$full_log_message = "Name: $name\nEmail: $email\nMessage: $message\n\n";
file_put_contents('messages_backup.log', date('Y-m-d H:i:s') . " - New message\n" . $full_log_message . "---\n\n", FILE_APPEND);
logMessage("Message saved to backup log");

// Return success even if mail fails (since we've saved the message)
echo json_encode([
    'success' => true, 
    'message' => 'Thank you for your message! I will get back to you soon.',
    'mail_status' => $mail_sent ? 'sent' : 'saved_only'
]);
?>
