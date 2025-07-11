import os
from django.db import models
from django.contrib.auth.models import User

def get_upload_path(instance, filename):
    # Returns: "music/<type_plural>/filename.mp3"
    type_folder = {
        'SONG': 'songs',
        'CHANT': 'chants', 
        'CLAP': 'claps'
    }.get(instance.type, 'other')  # Fixed: removed .lower() since choices are uppercase
    ext = os.path.splitext(filename)[1]
    filename = f"{instance.title}{ext}"  # Fixed: changed 'tite' to 'title'
    return f'music/{type_folder}/{filename}'

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
    TYPE_CHOICES = [  # Fixed: Defined as separate variable for better readability
        ('SONG', 'غنية'),
        ('CHANT', 'صيحة'),
        ('CLAP', 'صفقة')
    ]
    
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)  # Fixed: Used the variable
    lyrics = models.TextField(null=True, blank=True, help_text="Full chant/song lyrics")  # Added blank=True
    category = models.CharField(null=True, blank=True, max_length=50, choices=CATEGORY_CHOICES)  # Added blank=True
    difficulty = models.IntegerField(choices=DIFFICULTY_CHOICES, null=True, blank=True)  # Added null/blank
    
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)  # Added blank=True
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    audio_file = models.FileField(
        upload_to=get_upload_path,
        null=True,
        blank=True
    )
    
