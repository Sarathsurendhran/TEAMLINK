# class BlockCheckMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         return self.process_request(request)


#     def process_request(self, request):
#         if  request.user.is_authenticated and hasattr(request.user, 'is_active') and request.user.is_active:
#             from django.shortcuts import redirect
#             print("blocked")
        
#         response = self.get_response(request)
#         return response
        