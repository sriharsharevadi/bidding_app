# biidingapp/schema.py
import graphene
from graphene_django import DjangoObjectType
import channels_graphql_ws


from webapp.models import Order, Bid


class OrdType(DjangoObjectType):
    class Meta:
        model = Order
        fields = '__all__'


class BidType(DjangoObjectType):
    class Meta:
        model = Bid
        fields = ("id", "price", "order_id", "user_id")


class Query(graphene.ObjectType):
    all_orders = graphene.List(OrdType)
    bids_by_order = graphene.List(BidType, order_id=graphene.Int(required=True))

    def resolve_all_orders(root, info):
        MySubscription.subscribe(root, info)
        # We can easily optimize query count in the resolve method
        return Order.objects.all()

    def resolve_bids_by_order(root, info, order_id):
        try:
            MySubscription.publish(root, info)
            return Bid.objects.filter(order_id=order_id)
        except Bid.DoesNotExist:
            return None


# schema = graphene.Schema(query=Query)


class MySubscription(channels_graphql_ws.Subscription):
    """Simple GraphQL subscription."""

    # Subscription payload.
    event = graphene.String()

    # class Arguments:
    #     """That is how subscription arguments are defined."""
    #     arg1 = graphene.String()
    #     arg2 = graphene.String()

    @staticmethod
    def subscribe(root, info):
        """Called when user subscribes."""

        # Return the list of subscription group names.
        return ['group42']

    @staticmethod
    def publish(root, info):
        """Called to notify the client."""

        # Here `payload` contains the `payload` from the `broadcast()`
        # invocation (see below). You can return `MySubscription.SKIP`
        # if you wish to suppress the notification to a particular
        # client. For example, this allows to avoid notifications for
        # the actions made by this particular client.

        return MySubscription(event='Something has happened!')


class Subscription(graphene.ObjectType):
    """Root GraphQL subscription."""
    my_subscription = MySubscription.Field()


schema = graphene.Schema(
    query=Query,
    subscription=Subscription,
)