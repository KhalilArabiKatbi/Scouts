from django.contrib import admin
from .models import Music, ScoutContent

@admin.register(ScoutContent)
class ScoutContentAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'type', 'difficulty', 'author')
    list_filter = ('category', 'type', 'difficulty')
    search_fields = ('name', 'usage')

@admin.register(Music)
class ChantAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'difficulty', 'author')
    list_filter = ('category', 'difficulty')
    search_fields = ('title', 'lyrics')