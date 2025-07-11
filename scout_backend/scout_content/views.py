from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Music
from .serializers import MusicSerializer

class MusicViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows music entries to be viewed or edited.
    Supports filtering by type, category, and difficulty.
    Supports searching by title and lyrics.
    """
    queryset = Music.objects.all().order_by('-created_at') # Show newest first
    serializer_class = MusicSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Fields available for filtering
    filterset_fields = ['type', 'category', 'difficulty']

    # Fields available for searching
    search_fields = ['title', 'lyrics']

    # Fields available for ordering
    ordering_fields = ['title', 'type', 'category', 'difficulty', 'created_at', 'last_updated']
    ordering = ['title'] # Default ordering

    # Optional: Set author automatically if user is authenticated
    # def perform_create(self, serializer):
    #     if self.request.user.is_authenticated:
    #         serializer.save(author=self.request.user)
    #     else:
    #         # Handle cases where no user is logged in, if applicable
    #         # For example, save without an author or raise an error
    #         serializer.save()

    # Optional: Add permission classes if needed, e.g.:
    # from rest_framework.permissions import IsAuthenticatedOrReadOnly
    # permission_classes = [IsAuthenticatedOrReadOnly]
