# Mohamed Abdel Hamid - Portfolio Website

This is the source code for my personal portfolio website, showcasing my skills, projects, and experience.

## Features

- Responsive design for all devices
- Interactive UI with animations
- Contact form with PHP backend
- Project showcase with modal details
- Skills and experience sections

## Setup Instructions

### Prerequisites

- Web server with PHP support (Apache, Nginx, etc.)
- PHP 7.0 or higher

### Installation

1. Clone this repository to your web server's public directory:
   ```
   git clone https://github.com/moh-a-abde/moh-a-abde.github.io.git
   ```

2. Ensure PHP is properly configured on your server.

3. Make sure the `process_form.php` file has the correct permissions:
   ```
   chmod 755 process_form.php
   ```

4. Update the email address in `process_form.php` if needed:
   ```php
   $to = 'abde8473@stthomas.edu'; // Replace with your email
   ```

5. Create a `form_submissions.log` file and make it writable:
   ```
   touch form_submissions.log
   chmod 666 form_submissions.log
   ```

### Contact Form Configuration

The contact form uses PHP's `mail()` function to send emails. For this to work properly:

1. Ensure your server has a mail service configured (Postfix, Sendmail, etc.)
2. Check your PHP configuration to make sure the mail function is enabled
3. Test the form by submitting a message and checking if you receive the email

If emails are not being sent, check your server's mail logs for errors.

## Customization

- Update personal information in `index.html`
- Modify styles in `css/styles.css`
- Add or remove sections as needed

## License

All rights reserved. © 2024 Mohamed A. Abdel Hamid.
