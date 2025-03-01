<?php
// Test mail function
$to = 'abde8473@stthomas.edu';
$subject = 'Test Email from PHP';
$message = 'This is a test email sent from PHP on your local machine.';
$headers = 'From: test@example.com' . "\r\n" .
    'Reply-To: test@example.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

echo "Attempting to send email to $to...\n";
$result = mail($to, $subject, $message, $headers);

if ($result) {
    echo "Email sent successfully!\n";
} else {
    echo "Failed to send email.\n";
    echo "Check your mail server configuration.\n";
}

// Log the attempt
$log_file = 'form_submissions.log';
$log_message = date('Y-m-d H:i:s') . " - Test mail attempt. Result: " . ($result ? "Success" : "Failed") . "\n";
file_put_contents($log_file, $log_message, FILE_APPEND);

echo "Test logged to $log_file\n";
?> 