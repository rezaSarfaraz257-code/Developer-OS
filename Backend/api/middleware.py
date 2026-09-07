class ApiSecurityHeadersMiddleware:
    """Add restrictive browser headers to JSON API responses.

    The Django admin is deliberately excluded because it needs its own assets
    and forms.  A reverse proxy should still set equivalent global headers.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith("/api/"):
            response["Content-Security-Policy"] = (
                "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; "
                "form-action 'none'"
            )
            response["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
            response["Cross-Origin-Resource-Policy"] = "same-site"
        return response
