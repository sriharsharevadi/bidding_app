from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from django.contrib.auth.models import User


# Create your models here.
# class Customer(models.Model):
#     name = models.CharField(max_length=100)
#
#     def __str__(self):
#         return self.name


class Order(models.Model):
    ORDER_CHOICES = [
        ('a', 'Product A'),
        ('b', 'Product B'),
        ('c', 'Product C'),
    ]

    type = models.CharField(max_length=2, choices=ORDER_CHOICES)
    quantity = models.IntegerField(
        validators=[
            MaxValueValidator(200),
            MinValueValidator(1)
        ]
     )
    user = models.ForeignKey(User, related_name='order_user', on_delete=models.CASCADE)


class Bid(models.Model):
    price = models.IntegerField(
        validators=[
            MaxValueValidator(10000000),
            MinValueValidator(1)
        ]
     )
    order = models.ForeignKey(User, related_name='bid_order', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='bid_user', on_delete=models.CASCADE)