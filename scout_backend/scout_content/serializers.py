from rest_framework import serializers
from .models import Music

class MusicSerializer(serializers.ModelSerializer):
    # Make author field read-only as it's set automatically or not directly by API user
    author = serializers.StringRelatedField(read_only=True)
    # Display human-readable names for choice fields
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)

    class Meta:
        model = Music
        fields = [
            'id',
            'title',
            'type',
            'type_display',
            'lyrics',
            'category',
            'category_display',
            'difficulty',
            'difficulty_display',
            'audio_file',
            'author',
            'created_at',
            'last_updated'
        ]
        read_only_fields = ['created_at', 'last_updated']

    def validate_audio_file(self, value):
        """
        Check that the uploaded file is an audio file.
        You might want to add more specific validation, e.g., file size, specific audio formats.
        """
        if value:
            # Basic check for audio content type - can be expanded
            # For a more robust solution, consider using a library like python-magic
            main_type = value.content_type.split('/')[0]
            if main_type != 'audio':
                raise serializers.ValidationError("Unsupported file type. Please upload an audio file.")
        return value
