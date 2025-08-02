from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MusicViewSet, ScoutContentViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'music', MusicViewSet, basename='music')
router.register(r'scout-content', ScoutContentViewSet, basename='scout-content')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
