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


def get_scout_upload_path(instance, filename):
    # Determine the folder based on the category of the scout content
    category_folder = instance.category.lower()

    # Sanitize filename based on name
    file_ext = os.path.splitext(filename)[1].lower()
    filename = f"{instance.name.replace(' ', '_')}{file_ext}"

    # Return the full path
    return f'scout_content/{category_folder}/{filename}'


class ScoutContent(models.Model):
    # Type choices
    TYPE_CHOICES = [
        ('KNOT', 'عقدة'),
        ('LASHING_1', 'ربطة 1'),
        ('LASHING_2', 'ربطة 2'),
    ]

    # Category choices
    CATEGORY_CHOICES = [
        ('PIONEERING', 'عمل ريادي'),
        ('KNOTS', 'عقد'),
    ]

    # Difficulty levels
    DIFFICULTY_CHOICES = [
        (1, 'Easy'),
        (2, 'Medium'),
        (3, 'Hard'),
    ]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    difficulty = models.IntegerField(choices=DIFFICULTY_CHOICES)
    usage = models.TextField(help_text="Usage of the knot or lashing")

    # Links and Files
    youtube_link = models.URLField(max_length=200, null=True, blank=True)
    model_3d = models.URLField(max_length=200, null=True, blank=True, help_text="Link to a 3D model (e.g., on Sketchfab)")
    
    picture = models.ImageField(upload_to=get_scout_upload_path, null=True, blank=True)
    video = models.FileField(upload_to=get_scout_upload_path, null=True, blank=True)

    # Meta
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
