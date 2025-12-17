<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Update</title>
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
        .info-box {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .info-box h4 {
            margin-top: 0;
            color: #dc2626;
        }
        .info-box p {
            margin-bottom: 0;
            color: #7f1d1d;
        }
        .help-box {
            background-color: #eff6ff;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        .help-box h3 {
            margin-top: 0;
            color: #1e40af;
        }
        .help-item {
            display: flex;
            align-items: flex-start;
            padding: 8px 0;
        }
        .help-icon {
            font-size: 18px;
            margin-right: 10px;
        }
        .help-text {
            color: #374151;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .contact-button {
            display: inline-block;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
        }
        .encouragement {
            background-color: #fef3c7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .encouragement p {
            margin: 0;
            color: #92400e;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Army Public School, Alwar</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Dear {{ $alumni->name }},
            </div>
            
            <div class="message">
                <p>Thank you for your interest in joining the <strong>APS Alwar Alumni Network</strong>.</p>
                
                <p>After reviewing your registration, we regret to inform you that we were unable to approve your profile at this time.</p>
            </div>
            
            @if($alumni->rejection_reason)
            <div class="info-box">
                <h4>📋 Reason for Review</h4>
                <p>{{ $alumni->rejection_reason }}</p>
            </div>
            @endif
            
            <div class="help-box">
                <h3>What Can You Do?</h3>
                <div class="help-item">
                    <span class="help-icon">✉️</span>
                    <span class="help-text">Contact us at <strong>{{ $contactEmail }}</strong> for clarification</span>
                </div>
                <div class="help-item">
                    <span class="help-icon">📝</span>
                    <span class="help-text">Provide any additional documentation to verify your alumni status</span>
                </div>
                <div class="help-item">
                    <span class="help-icon">🔄</span>
                    <span class="help-text">Re-register with correct and complete information</span>
                </div>
            </div>
            
            <div class="button-container">
                <a href="mailto:{{ $contactEmail }}?subject=Alumni Registration Query - {{ $alumni->name }}" class="contact-button">
                    Contact Us
                </a>
            </div>
            
            <div class="encouragement">
                <p>💚 We value every member of our APS Alwar family and would love to have you in our alumni network. Please don't hesitate to reach out!</p>
            </div>
        </div>
        
        <div class="footer">
            <p>
                <strong>Army Public School, Alwar</strong><br>
                Alwar Military Station, Alwar, Rajasthan - 301001
            </p>
            <p>
                <a href="{{ url('/') }}">Visit Website</a> | 
                <a href="{{ url('/contact') }}">Contact Us</a>
            </p>
        </div>
    </div>
</body>
</html>
