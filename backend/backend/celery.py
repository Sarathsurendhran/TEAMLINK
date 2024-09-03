# from __future__ import absolute_import, unicode_literals
# import os

# from celery import Celery
# from django.conf import settings


# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# app = Celery("backend")

# app.conf.enable_utc = False

# app.conf.update(timezone="Asia/Kolkata")

# app.config_from_object(settings, namespace="CELERY")

# app.autodiscover_tasks()
  
  
# @app.task(bind=True)
# def debug_task(self):
#     print(f"Request:{self.request!r}")

from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
from backend import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.conf.update(
    broker_url=settings.broker_url,
    result_backend=settings.result_backend,
    timezone=settings.timezone,
)

# Load Django settings for Celery
app.config_from_object(settings, namespace="CELERY")

# Autodiscover tasks
app.autodiscover_tasks()

# Debug task
@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

