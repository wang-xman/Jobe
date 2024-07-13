from django.shortcuts import render

# Create your views here.
import json
import base64
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt

def dashboard(request):
    template = loader.get_template('dashboard.html')
    context = {
        'context': 'items_all',
    }
    return HttpResponse( template.render(context, request) )


@csrf_exempt
def submission(request):
    """ Accept form submission via POST method
    The dictionary is printed on the terminal.
    URL to this view is /demo/submission
    """
    if request.method == 'POST':
        form_content = json.loads( request.body.decode('utf-8') )['content']
        print(form_content)
        return JsonResponse(form_content)


@csrf_exempt
def receive_image(request):
    """ Make sure a directory /tmp exists inside
    jobeserver project directory. The saved file is
    named "demo_cropped_image.jpg"
    """
    filepath = './tmp/demo_cropped_image.jpg'
    image_data = base64.b64decode(request.POST['image'])
    image_file = open(filepath, "wb")
    image_file.write(image_data)
    image_file.close()
    label =  request.POST['label']
    city =  request.POST['city']
    print( "{} is found in {}".format(label, city) )
    return JsonResponse({"context": "okay"})