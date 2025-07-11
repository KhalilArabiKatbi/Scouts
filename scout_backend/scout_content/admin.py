from django.contrib import admin
from .models import Music

@admin.register(Music)
class ChantAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'difficulty', 'author')
    list_filter = ('category', 'difficulty')
    search_fields = ('title', 'lyrics')