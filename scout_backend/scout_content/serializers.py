from rest_framework import serializers
from .models import Music

class MusicSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
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
            'video_file', # Added video file
            'web_link',   # Added web link
            'author',
            'created_at',
            'last_updated'
        ]
        read_only_fields = ['created_at', 'last_updated']

    def validate_audio_file(self, value):
        if value:
            main_type = value.content_type.split('/')[0]
            if main_type != 'audio':
                raise serializers.ValidationError("Unsupported file type. Only audio files are allowed.")
        return value

    def validate_video_file(self, value):
        if value:
            main_type = value.content_type.split('/')[0]
            if main_type != 'video':
                raise serializers.ValidationError("Unsupported file type. Only video files are allowed.")
        return value

    def validate(self, data):
        """
        Ensure that at least one of the content fields is provided.
        """
        has_lyrics = data.get('lyrics') and data.get('lyrics').strip()
        has_audio = data.get('audio_file')
        has_video = data.get('video_file')
        has_link = data.get('web_link') and data.get('web_link').strip()

        if not any([has_lyrics, has_audio, has_video, has_link]):
            raise serializers.ValidationError(
                "At least one content field (lyrics, audio, video, or web link) is required."
            )
        return data
