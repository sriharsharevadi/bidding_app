from rest_framework import serializers
from .models import Order, Bid
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = User
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Order
        fields = '__all__'


class BidSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Bid
        fields = '__all__'
