from django.contrib import admin
from webapp.models import Order, Bid, Config

# Register your models here.
admin.site.register(Order)
admin.site.register(Bid)
admin.site.register(Config)