# biidingapp/schema.py
import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
import channels_graphql_ws
from graphene_django.debug import DjangoDebug
from graphene_django.rest_framework.mutation import SerializerMutation


from webapp.models import Order, Bid
from django.contrib.auth import get_user_model
from webapp.serializers import UserSerializer
from webapp.helpers import get_config_value


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
    available_orders = graphene.List(OrdType)
    my_bids = graphene.List(BidType)
    bids_by_order = graphene.List(BidType, order_id=graphene.Int(required=True), req=graphene.Boolean(required=False))
    order_details = graphene.Field(OrdType, order_id=graphene.Int(required=True))
    me = graphene.Field(UserType)

    def resolve_me(self, info):
        print(info.context)
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        return user

    def resolve_my_bids(root,  info):
        return Bid.objects.filter(user__username=info.context.user).select_related('order')

    def resolve_available_orders(root, info):
        return Order.objects.all().select_related('user').exclude(user__username=info.context.user).exclude( order_bid__user__username=info.context.user)

    def resolve_bids_by_order(root, info, order_id, req):
        if get_config_value("show_bids") or req:
            return Bid.objects.filter(order_id=order_id).select_related('user')
        else:
            return None

    def resolve_order_details(root, info, order_id):
        try:
            return Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return None


class UserMutation(SerializerMutation):
    class Meta:
        serializer_class = UserSerializer
        model_operations = ['create', 'update']
        lookup_field = 'id'



class OrderMutation(graphene.Mutation):
    order = graphene.Field(OrdType)

    class Arguments:
        id = graphene.Int(required=False)
        type = graphene.String(required=True)
        quantity = graphene.Int(required=True)

    def mutate(self, info, **kwargs):
        # print(kwargs)
        id = kwargs.get('id', None)
        type = kwargs.get('type', None)
        quantity = kwargs.get('quantity', None)

        if id:
            order = Order.objects.get(pk=id)
            if type:
                order.type = type
            if quantity:
                order.quantity = quantity
            order.save()
        else:
            user = info.context.user
            order = Order(
                type=type,
                quantity=quantity,
                user=user,
            )
            order.save()
        OnNewOrder.update("order")
        return OrderMutation(order=order)


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

        OnNewOrder.update("bid")
        return CreateBid(bid=bid)


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
        model = graphene.String()

    def subscribe(self, info, model):
        """Client subscription handler."""
        print(self, info)
        del info

    def publish(self, info, model):
        print('im publishing')
        # print(info.context.user)
        """Called to prepare the subscription notification message."""

        model = model

        return OnNewOrder(
            model=model,
        )

    @classmethod
    def update(cls, model):
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
    refresh = OnNewOrder.Field()


schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)
