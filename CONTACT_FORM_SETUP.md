# Contact Form Setup Guide

This guide explains how to set up and configure the contact form PHP endpoint.

## Prerequisites

- PHP 7.0 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)
- Google reCAPTCHA v3 account

## Installation Steps

### 1. Database Setup

Create the database table by running the following SQL:

```sql
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    asunto VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at DATETIME NOT NULL,
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Configuration

Edit the `config.php` file and update the following settings:

#### Database Configuration
```php
define('DB_HOST', 'localhost');           // Your database host
define('DB_USER', 'your_database_user');  // Your database username
define('DB_PASS', 'your_database_password'); // Your database password
define('DB_NAME', 'your_database_name');  // Your database name
```

#### Email Configuration
```php
define('NOTIFICATION_EMAIL', 'info@taopower.com.ar'); // Email to receive notifications
define('FROM_EMAIL', 'noreply@taopower.com.ar');      // From email address
define('FROM_NAME', 'TAO Power Contact Form');        // From name
```

#### reCAPTCHA Configuration
```php
define('RECAPTCHA_SECRET_KEY', 'your_recaptcha_secret_key'); // Your reCAPTCHA v3 secret key
```

**Note:** The public reCAPTCHA key is already configured in the HTML and JavaScript files: `6Le0CzgsAAAAAOCgxeAI5gaWTGkjat-5Bbn0cXZP`

### 3. File Permissions

Ensure the web server has read permissions on:
- `submit-contact.php`
- `config.php`

### 4. Testing

1. Open `contacto.html` in your browser
2. Fill out the contact form
3. Submit the form
4. Check that:
   - The message is saved in the database
   - An email notification is sent
   - The user sees a success message

## Features

### Security Features
- **reCAPTCHA v3**: Protects against spam and bot submissions (minimum score: 0.5)
- **Input Validation**: All inputs are validated and sanitized
- **SQL Injection Prevention**: Uses prepared statements with mysqli
- **XSS Prevention**: All user inputs are escaped with htmlspecialchars

### Data Collected
- Name (nombre)
- Email
- Phone (telefono) - optional
- Subject (asunto)
- Message (mensaje)
- IP Address (for security and tracking)
- Read status (is_read) - for internal tracking
- Timestamp (created_at)

### Email Notifications
When a form is submitted, an email notification is sent to the configured email address with:
- Sender's name, email, and phone
- Subject and message
- IP address and timestamp
- Message ID for reference

## Troubleshooting

### Form submission fails
- Check PHP error logs
- Verify database credentials in `config.php`
- Ensure the `contact_messages` table exists
- Verify reCAPTCHA secret key is correct

### Email not received
- Check spam folder
- Verify email configuration in `config.php`
- Ensure PHP `mail()` function is properly configured on the server
- Check PHP error logs for mail errors

### reCAPTCHA errors
- Verify the public key in `contacto.html` and `js/main.js`
- Verify the secret key in `config.php`
- Check that your domain is authorized in Google reCAPTCHA console

## Security Notes

⚠️ **IMPORTANT**: The `config.php` file is already added to `.gitignore` to prevent committing sensitive credentials. Make sure this file is never committed to version control.

## Database Management

To view unread messages:
```sql
SELECT * FROM contact_messages WHERE is_read = 0 ORDER BY created_at DESC;
```

To mark a message as read:
```sql
UPDATE contact_messages SET is_read = 1 WHERE id = ?;
```

To get message statistics:
```sql
SELECT 
    COUNT(*) as total_messages,
    SUM(is_read) as read_messages,
    COUNT(*) - SUM(is_read) as unread_messages
FROM contact_messages;
```
