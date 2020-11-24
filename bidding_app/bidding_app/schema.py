# biidingapp/schema.py
import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
import channels_graphql_ws
from graphene_django.debug import DjangoDebug


from webapp.models import Order, Bid
from django.contrib.auth import get_user_model
from graphene_django.rest_framework.mutation import SerializerMutation

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
    users = graphene.List(UserType)
    me = graphene.Field(UserType)

    def resolve_users(self, info):
        return get_user_model().objects.all()

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        return user

    def resolve_all_orders(root, info):
        print(info.context.user)
        # We can easily optimize query count in the resolve method
        return Order.objects.all()

    def resolve_bids_by_order(root, info, order_id):
        try:
            return Bid.objects.filter(user_id=order_id)
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


class BidMutation(SerializerMutation):
    class Meta:
        serializer_class = BidSerializer
        model_operations = ['create', 'update']
        lookup_field = 'id'

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
    bid_serializer = BidMutation.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


class OnNewOrder(channels_graphql_ws.Subscription):
    """Subscription triggers on a new chat message."""

    order = graphene.List(OrdType)

    # class Arguments:
    #     """Subscription arguments."""
    #
    #     chatroom = graphene.String()

    def subscribe(self, info):
        """Client subscription handler."""
        del info
        # Specify the subscription group client subscribes to.
        # return [chatroom] if chatroom is not None else None

    def publish(self, info):
        print(info.context.user)
        """Called to prepare the subscription notification message."""

        # The `self` contains payload delivered from the `broadcast()`.
        # quantity = self["quantity"]
        # type = self["type"]
        # user = self["user"]
        order = Order.objects.all()

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
        print(order)

        return OnNewOrder(
            order=order,
        )

    @classmethod
    def new_order(cls, quantity, type, user):
        """Auxiliary function to send subscription notifications.

        It is generally a good idea to encapsulate broadcast invocation
        inside auxiliary class methods inside the subscription class.
        That allows to consider a structure of the `payload` as an
        implementation details.
        """
        cls.broadcast(
            payload={"quantity": quantity, "type": type, "user": user},
        )


class Subscription(graphene.ObjectType):
    """GraphQL subscriptions."""

    on_new_order= OnNewOrder.Field()


schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)
