from django.urls import path
from .import views

urlpatterns = [
    path("projects/", views.project_api, name="projects"),
]