<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            color: #1e40af;
            margin-bottom: 20px;
        }
        .message {
            margin-bottom: 30px;
            color: #555;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
        }
        .info-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
        }
        .info-box p {
            margin: 0;
            color: #92400e;
        }
        .details {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .details h3 {
            margin-top: 0;
            color: #1e40af;
        }
        .details-item {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .details-item:last-child {
            border-bottom: none;
        }
        .details-label {
            font-weight: 600;
            color: #6b7280;
            width: 120px;
        }
        .details-value {
            color: #374151;
        }
        .footer {
            background-color: #1e293b;
            color: #94a3b8;
            padding: 30px;
            text-align: center;
            font-size: 14px;
        }
        .footer a {
            color: #60a5fa;
        }
        .link-fallback {
            margin-top: 20px;
            padding: 15px;
            background-color: #f1f5f9;
            border-radius: 6px;
            word-break: break-all;
            font-size: 12px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Army Public School, Alwar</h1>
            <p>Alumni Network</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello {{ $alumni->name }}! 👋
            </div>
            
            <div class="message">
                <p>Thank you for registering with the <strong>APS Alwar Alumni Network</strong>! We're excited to have you reconnect with your alma mater.</p>
                
                <p>To complete your registration and verify your email address, please click the button below:</p>
            </div>
            
            <div class="button-container">
                <a href="{{ $verificationUrl }}" class="verify-button">
                    ✓ Verify My Email
                </a>
            </div>
            
            <div class="info-box">
                <p><strong>⏰ Important:</strong> This verification link will expire in 48 hours. After verification, your profile will be reviewed by our admin team before being published.</p>
            </div>
            
            <div class="details">
                <h3>Your Registration Details</h3>
                <div class="details-item">
                    <span class="details-label">Name:</span>
                    <span class="details-value">{{ $alumni->name }}</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Batch Year:</span>
                    <span class="details-value">{{ $alumni->batch_year }}</span>
                </div>
                @if($alumni->current_designation)
                <div class="details-item">
                    <span class="details-label">Designation:</span>
                    <span class="details-value">{{ $alumni->current_designation }}</span>
                </div>
                @endif
                @if($alumni->organization)
                <div class="details-item">
                    <span class="details-label">Organization:</span>
                    <span class="details-value">{{ $alumni->organization }}</span>
                </div>
                @endif
            </div>
            
            <div class="link-fallback">
                <strong>Can't click the button?</strong> Copy and paste this link into your browser:<br>
                {{ $verificationUrl }}
            </div>
        </div>
        
        <div class="footer">
            <p>
                <strong>Army Public School, Alwar</strong><br>
                Alwar Military Station, Alwar, Rajasthan - 301001
            </p>
            <p>
                <a href="{{ url('/') }}">Visit Our Website</a> | 
                <a href="{{ url('/contact') }}">Contact Us</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px;">
                If you didn't register for the APS Alwar Alumni Network, please ignore this email.
            </p>
        </div>
    </div>
</body>
</html>
