"""URL configuration for demo app"""
from django.urls import path

from . import views

urlpatterns = [
    # localhost/demo
    path("", views.dashboard, name="dashboard"),
    # localhost/demo/submission
    path("submission/", views.submission, name="submission"),
    # localhost/demo/receive_image
    path("receive_image/", views.receive_image, name="receive_image"),
]