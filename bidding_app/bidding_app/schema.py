# biidingapp/schema.py
import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
import channels_graphql_ws
from graphene_django.debug import DjangoDebug
from rest_framework import serializers
from graphene_django.rest_framework.mutation import SerializerMutation


from webapp.models import Order, Bid
from django.contrib.auth import get_user_model
from webapp.serializers import UserSerializer, OrderSerializer, BidSerializer


class OrdType(DjangoObjectType):
    class Meta:
        model = Order
        fields = '__all__'
        # convert_choices_to_enum = False


class BidType(DjangoObjectType):
    class Meta:
        model = Bid
        fields = '__all__'


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class Query(graphene.ObjectType):
    debug = graphene.Field(DjangoDebug, name='_debug')
    all_orders = graphene.List(OrdType)
    bids_by_order = graphene.List(BidType, order_id=graphene.Int(required=True))
    # users = graphene.List(UserType)
    me = graphene.Field(UserType)

    # def resolve_users(self, info):
    #     return get_user_model().objects.all()

    def resolve_me(self, info):
        print(info.context)
        user = info.context.user

        if user.is_anonymous:
            raise Exception('Not logged in!')

        return user

    def resolve_all_orders(root, info):
        # print(info.context.user)
        # We can easily optimize query count in the resolve method
        print(info.context)
        # Order.objects.filter()
        return Order.objects.all().exclude(user__username=info.context.user).exclude( order_bid__user__username=info.context.user)

    def resolve_bids_by_order(root, info, order_id):
        try:
            return Bid.objects.filter(order_id=order_id)
        except Bid.DoesNotExist:
            return None
#
# class CreateOrder(graphene.Mutation):
#     order = graphene.Field(OrdType)
#
#     class Arguments:
#         quantity = graphene.Int(required=True)
#         type = graphene.String(required=True)
#         user = graphene.Int(required=True)
#
#     def mutate(self, info, quantity, type, user):
#         user = User.objects.get(id=user)
#         order = Order(
#             quantity=quantity,
#             type=type,
#             user=user,
#         )
#         order.save()
#
#         OnNewOrder.new_order(quantity=quantity, type=type, user=user)
#         return CreateOrder(order=order)


class UserMutation(SerializerMutation):
    class Meta:
        serializer_class = UserSerializer
        model_operations = ['create', 'update']
        lookup_field = 'id'


class OrderMutation(SerializerMutation):
    class Meta:
        serializer_class = OrderSerializer
        model_operations = ['create', 'update']
        lookup_field = 'id'
        convert_choices_to_enum = False

    @classmethod
    def perform_mutate(cls, serializer, info):
        obj = serializer.save()
        OnNewOrder.new_order("order")

        kwargs = {}
        for f, field in serializer.fields.items():
            if not field.write_only:
                if isinstance(field, serializers.SerializerMethodField):
                    kwargs[f] = field.to_representation(obj)
                else:
                    kwargs[f] = field.get_attribute(obj)

        return cls(errors=None, **kwargs)


class CreateBid(graphene.Mutation):
    bid = graphene.Field(BidType)

    class Arguments:
        id = graphene.Int(required=False)
        price = graphene.Int(required=True)
        orderId = graphene.String(required=True)

    def mutate(self, info, **kwargs):
        # print(kwargs)
        id = kwargs.get('id', None)
        price = kwargs.get('price', None)
        orderId = kwargs.get('orderId', None)

        if id:
            bid = Bid.objects.get(pk=id)
            bid.price = price
            bid.save()
        else:
            user = info.context.user
            order = Order.objects.get(pk= orderId)
            bid = Bid(
                price=price,
                order=order,
                user=user,
            )
            bid.save()

        # OnNewOrder.new_order(quantity=quantity, type=type, user=user)
        return CreateBid(bid=bid)


class BidMutation(SerializerMutation):
    class Meta:
        serializer_class = BidSerializer
        model_operations = ['create', 'update']
        lookup_field = 'id'

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        kwargs = cls.get_serializer_kwargs(root, info, **input)
        serializer = cls._meta.serializer_class(**kwargs)

        if serializer.is_valid():
            return cls.perform_mutate(serializer, info)
        else:
            errors = ErrorType.from_errors(serializer.errors)

            return cls(errors=errors)

    @classmethod
    def perform_mutate(cls, serializer, info):
        print("hii", serializer.data)
        obj = serializer.save()
        OnNewOrder.new_order()

        kwargs = {}
        for f, field in serializer.fields.items():
            if not field.write_only:
                if isinstance(field, serializers.SerializerMethodField):
                    kwargs[f] = field.to_representation(obj)
                else:
                    kwargs[f] = field.get_attribute(obj)

        return cls(errors=None, **kwargs)

    # @classmethod
    # def get_serializer_kwargs(cls, root, info, **input):
    #     if 'id' in input:
    #         instance = Bid.objects.filter(
    #             id=input['id']
    #         ).first()
    #         if instance:
    #             return {'instance': instance, 'data': input, 'partial': True}
    #
    #         else:
    #             raise http.Http404
    #
    #     return {'data': input, 'partial': True}
# subject = graphene.Field(BidType)
    # message = ObjectField()
    # status = graphene.Int()
    #
    # class Arguments:
    #     input = graphene.List(Bidinput)
    #
    # @classmethod
    # def mutate(cls, root, info, **kwargs):
    #     serializer = BidSerializer(data=kwargs)
    #     print(serializer)
    #     if serializer.is_valid():
    #         obj = serializer.save()
    #         msg = 'success'
    #     else:
    #         msg = serializer.errors
    #         obj = None
    #         print(msg)
    #     return cls(subject=obj, message=msg, status=200

class Mutation(graphene.ObjectType):
    create_user = UserMutation.Field()
    create_order = OrderMutation.Field()
    create_bid = CreateBid.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


class OnNewOrder(channels_graphql_ws.Subscription):
    """Subscription triggers on a new chat message."""

    model = graphene.String()

    class Arguments:
        """Subscription arguments."""

        model = graphene.String()

    def subscribe(self, info, model):
        """Client subscription handler."""
        del info
        # Specify the subscription group client subscribes to.
        # return [chatroom] if chatroom is not None else None

    def publish(self, info, model):
        print('im publishing')
        # print(info.context.user)
        """Called to prepare the subscription notification message."""

        # The `self` contains payload delivered from the `broadcast()`.
        # quantity = self["quantity"]
        # type = self["type"]
        # user = self["user"]
        model = model

        # Method is called only for events on which client explicitly
        # subscribed, by returning proper subscription groups from the
        # `subscribe` method. So he either subscribed for all events or
        # to particular chatroom.
        # assert chatroom is None or chatroom == new_msg_chatroom

        # Avoid self-notifications.
        # if (
        #     info.context.user.is_authenticated
        #     and new_msg_sender == info.context.user.username
        # ):
        #     return OnNewOrder.SKIP

        return OnNewOrder(
            model=model,
        )

    @classmethod
    def new_order(cls, model):
        """Auxiliary function to send subscription notifications.

        It is generally a good idea to encapsulate broadcast invocation
        inside auxiliary class methods inside the subscription class.
        That allows to consider a structure of the `payload` as an
        implementation details.
        """
        cls.broadcast(
            payload={
                'model': model
            },
        )


class Subscription(graphene.ObjectType):
    """GraphQL subscriptions."""

    refresh= OnNewOrder.Field()


schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)
