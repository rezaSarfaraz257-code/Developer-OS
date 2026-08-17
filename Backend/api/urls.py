from django.urls import path
from . import views

urlpatterns = [
    path("projects/", views.projects_api, name="projects"),
    path("projects/<int:pk>/", views.project_detail_api, name="detail"),
    path("profile/", views.profile_api, name="profile"),
]