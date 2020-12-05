from webapp.models import Config


def get_config_value(name):
    try:
        config = Config.objects.get(name=name)
        if config.enabled:
            return True
        else:
            return False
    except Config.DoesNotExist:
        return False
