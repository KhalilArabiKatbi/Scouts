import os
from django.db import models
from django.contrib.auth.models import User

def get_upload_path(instance, filename):
    # Returns: "music/<type_plural>/filename.mp3"
    type_folder = {
        'SONG': 'songs',
        'CHANT': 'chants',
        'CLAP': 'claps'
    }.get(instance.type, 'other')

    # Determine if the file is audio or video to place it in the correct subfolder
    # This is a basic check based on file extension, which might not be foolproof
    file_ext = os.path.splitext(filename)[1].lower()
    if file_ext in ['.mp3', '.wav', '.ogg', '.m4a']:
        content_folder = 'audio'
    elif file_ext in ['.mp4', '.mov', '.avi', '.mkv']:
        content_folder = 'video'
    else:
        content_folder = 'other' # Fallback for other file types

    # Standardize filename based on title
    filename = f"{instance.title}{file_ext}"

    return f'music/{type_folder}/{content_folder}/{filename}'


class Music(models.Model):
    # Categories for filtering
    CATEGORY_CHOICES = [
        ('CAMPFIRE', 'Campfire'),
        ('MARCHING', 'Marching'),
        ('TRADITIONAL', 'Traditional'),
        ('FUN', 'Fun'),
    ]

    # Difficulty levels
    DIFFICULTY_CHOICES = [
        (1, 'Easy'),
        (2, 'Medium'),
        (3, 'Hard'),
    ]

    # Type choices
    TYPE_CHOICES = [
        ('SONG', 'Song'),
        ('CHANT', 'Chant'),
        ('CLAP', 'Clap')
    ]

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    lyrics = models.TextField(null=True, blank=True, help_text="Full chant/song lyrics")
    category = models.CharField(null=True, blank=True, max_length=50, choices=CATEGORY_CHOICES)
    difficulty = models.IntegerField(choices=DIFFICULTY_CHOICES, null=True, blank=True)

    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    # File fields for audio and video
    audio_file = models.FileField(
        upload_to=get_upload_path,
        null=True,
        blank=True,
        help_text="Upload an audio file (e.g., MP3, WAV)."
    )

    video_file = models.FileField(
        upload_to=get_upload_path,
        null=True,
        blank=True,
        help_text="Upload a video file (e.g., MP4, MOV)."
    )

    # Link field for web content
    web_link = models.URLField(
        max_length=200,
        null=True,
        blank=True,
        help_text="Link to a video or resource (e.g., YouTube)."
    )
    
