<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Alumni Network</title>
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
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header .emoji {
            font-size: 48px;
            margin-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 22px;
            color: #059669;
            margin-bottom: 20px;
        }
        .message {
            margin-bottom: 30px;
            color: #555;
            font-size: 16px;
        }
        .highlight-box {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .highlight-box h3 {
            margin-top: 0;
            color: #047857;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .primary-button {
            display: inline-block;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 10px;
        }
        .secondary-button {
            display: inline-block;
            background-color: #f1f5f9;
            color: #475569;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            margin: 10px;
        }
        .benefits {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        .benefits h3 {
            margin-top: 0;
            color: #1e40af;
        }
        .benefit-item {
            display: flex;
            align-items: flex-start;
            padding: 10px 0;
        }
        .benefit-icon {
            font-size: 20px;
            margin-right: 12px;
        }
        .benefit-text {
            color: #374151;
        }
        .social-connect {
            text-align: center;
            padding: 20px;
            background-color: #fef3c7;
            border-radius: 8px;
            margin: 20px 0;
        }
        .social-connect h4 {
            margin-top: 0;
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
            <div class="emoji">🎉</div>
            <h1>Congratulations!</h1>
            <p>Your Alumni Profile Has Been Approved</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Dear {{ $alumni->name }},
            </div>
            
            <div class="message">
                <p>We're thrilled to inform you that your registration with the <strong>APS Alwar Alumni Network</strong> has been approved!</p>
                
                <p>You are now officially part of our growing alumni community. Your profile is live and visible to fellow alumni and current students seeking inspiration.</p>
            </div>
            
            <div class="highlight-box">
                <h3>🏆 Welcome to the Family!</h3>
                <p>Batch of {{ $alumni->batch_year }} | {{ $alumni->category_label ?? 'APS Alwar Alumni' }}</p>
            </div>
            
            <div class="button-container">
                <a href="{{ $profileUrl }}" class="primary-button">
                    View Your Profile
                </a>
                <br>
                <a href="{{ $alumniPageUrl }}" class="secondary-button">
                    Browse Alumni Directory
                </a>
            </div>
            
            <div class="benefits">
                <h3>What's Next?</h3>
                <div class="benefit-item">
                    <span class="benefit-icon">🔗</span>
                    <span class="benefit-text"><strong>Connect:</strong> Reconnect with old friends and classmates from the alumni directory</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">📅</span>
                    <span class="benefit-text"><strong>Events:</strong> Stay updated about alumni meets and school events</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">🌟</span>
                    <span class="benefit-text"><strong>Inspire:</strong> Your success story will inspire current students</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">🤝</span>
                    <span class="benefit-text"><strong>Contribute:</strong> Participate in mentorship programs and school initiatives</span>
                </div>
            </div>
            
            <div class="social-connect">
                <h4>📱 Stay Connected</h4>
                <p>Follow us on social media and join our alumni WhatsApp group to stay updated!</p>
            </div>
        </div>
        
        <div class="footer">
            <p>
                <strong>Army Public School, Alwar</strong><br>
                Alwar Military Station, Alwar, Rajasthan - 301001
            </p>
            <p>
                <a href="{{ url('/') }}">Visit Website</a> | 
                <a href="{{ url('/alumni') }}">Alumni Network</a> |
                <a href="{{ url('/contact') }}">Contact Us</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px;">
                Once a part of APS Alwar, always a part of APS Alwar! 💚
            </p>
        </div>
    </div>
</body>
</html>
