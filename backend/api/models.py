from django.db import models


class Post(models.Model):
    category_id = models.IntegerField(blank=True, null=True)
    title = models.CharField(max_length=128, blank=True, null=True)
    subtitle = models.CharField(max_length=128, blank=True, null=True)
    url = models.CharField(max_length=128, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    date_published = models.DateTimeField(blank=True, null=True)