from django.core.mail import send_mail
from django.conf import settings
from urllib.parse import urljoin


def send_invitation(email, workspace_id):
   try:
    email_from = settings.EMAIL_HOST_USER
    base_url = "http://localhost:3000/"
    invitation_link = urljoin(base_url, f"?join={workspace_id}")
    
    send_mail(
        "Invitation to Join TeamLink Workspace",
        "You are invited to join our platform. Please click the link to register:" f"{invitation_link}",
        email_from,
        [email],
        fail_silently=False,
    )
   except Exception as e:
     print(e)
