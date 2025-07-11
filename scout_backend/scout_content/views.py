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

    # Permissions
    from rest_framework.permissions import IsAuthenticatedOrReadOnly
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """
        Set the author of the music entry to the current user upon creation.
        """
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            # This part should ideally not be reached for POST if IsAuthenticatedOrReadOnly is working,
            # as POST requests would require authentication.
            # If anonymous creation was desired, permission_classes would be AllowAny for POST.
            serializer.save()

    # Optional: Further customize perform_update or perform_destroy if needed
    # def perform_update(self, serializer):
    #     # Example: only allow author to update their own music
    #     # music_entry = self.get_object()
    #     # if music_entry.author != self.request.user:
    #     #     from rest_framework.exceptions import PermissionDenied
    #     #     raise PermissionDenied("You do not have permission to edit this music entry.")
    #     serializer.save()
