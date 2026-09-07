from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db import models


class EncryptedTextField(models.TextField):
    """Store text encrypted with Fernet as ``enc:v1:<ciphertext>``.

    Plain-text values from an earlier release remain readable once and are
    encrypted the next time the row is saved, allowing a non-destructive
    migration of existing GitHub connections.
    """

    prefix = "enc:v1:"

    @staticmethod
    def _fernet():
        key = settings.GITHUB_TOKEN_ENCRYPTION_KEY
        if not key:
            raise ImproperlyConfigured(
                "GITHUB_TOKEN_ENCRYPTION_KEY is required before GitHub OAuth can be used."
            )
        try:
            return Fernet(key.encode())
        except (TypeError, ValueError) as error:
            raise ImproperlyConfigured("GITHUB_TOKEN_ENCRYPTION_KEY is not a valid Fernet key.") from error

    def from_db_value(self, value, expression, connection):
        if value is None or not value.startswith(self.prefix):
            return value
        try:
            return self._fernet().decrypt(value[len(self.prefix):].encode()).decode()
        except InvalidToken as error:
            raise ImproperlyConfigured("An encrypted GitHub token could not be decrypted.") from error

    def get_prep_value(self, value):
        value = super().get_prep_value(value)
        if not value or value.startswith(self.prefix):
            return value
        return self.prefix + self._fernet().encrypt(value.encode()).decode()
