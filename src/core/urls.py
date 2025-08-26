# src/core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Vista original (mantener)
    path("", views.item_list, name="item_list"),
    # API Endpoints
    path("api/items/", views.api_items, name="api_items"),
    path("api/items/<int:item_id>/", views.api_item_detail, name="api_item_detail"),
]
