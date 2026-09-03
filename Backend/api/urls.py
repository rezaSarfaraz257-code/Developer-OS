from django.urls import path
from . import views

urlpatterns = [
    path("projects/", views.projects_api, name="projects"),
    path("projects/<int:pk>/", views.project_detail_api, name="detail"),
    path("profile/", views.profile_api, name="profile"),
    path("register/", views.register_api, name="register"),
    path("favorites/", views.favorites_api, name="favorites"),
    path("resources/", views.resources_api, name="resources"),
    path("workflows/", views.workflows_api, name="workflows"),
    path("tools/", views.tools_api, name="tools"),
    path("snippets/", views.snippets_api, name="snippets"),
    path("github/authorize/", views.github_authorize, name="github-authorize"),
    path("github/callback/", views.github_callback, name="github-callback"),
    path("github/account/", views.github_account_api, name="github-account"),
    path("github/repos/", views.github_repos_api, name="github-repos"),
    path("github/sync-activity/", views.github_sync_activity, name="github-sync"),
]