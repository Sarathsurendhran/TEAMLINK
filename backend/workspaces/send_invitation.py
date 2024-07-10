from django.core.mail import send_mail
from django.conf import settings
from urllib.parse import urljoin


def send_invitation(email, encrypted_data):
    try:
        email_from = settings.EMAIL_HOST_USER
        base_url = "http://localhost:3000/register"
        invitation_link = urljoin(base_url, f"?join={encrypted_data}")

        # HTML content for the email
        html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h1>Hi {email},</h1>
                <h2>You are invited to join TeamLink!</h2>
                <p>Please click the link below to register:</p>
                <p><a href="{invitation_link}" target="_blank">{invitation_link}</a></p>
                <p>See you soon on TeamLink!</p>
            </body>
            </html>
        """

        send_mail(
            "Invitation to Join TeamLink Workspace",
            "You are invited to join TeamLink. Please check your email for details.",
            email_from,
            [email],
            fail_silently=False,
            html_message=html_content,
        )
    except Exception as e:
        print(e)
