from django.conf import settings
from django.core.management.base import BaseCommand
from api.models import Post # our model
from api.helpers import client # connection object
from openai import OpenAI


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('command_name', type=str)

    def handle(self, *args, **kwargs):
        command_name = kwargs['command_name']

        if client.operations.is_healthy():
            if command_name == 'schema':
                schema = {
                    'name': 'posts',
                    'fields': [
                        {
                            'name':  'id',
                            'type':  'string',
                        },
                        {
                            'name':  'title',
                            'type':  'string',
                        },
                        {
                            'name':  'content',
                            'type':  'string',
                        },
                        {
                            'name':  'summary',
                            'type':  'string',
                        },
                        {
                            'name':  'url',
                            'type':  'string',
                        }
                    ],
                }

                try:
                    res = client.collections.create(schema)
                    print(res)
                except Exception as e:
                    print(e)

            elif command_name == 'destroy':
                try:
                    res = client.collections['posts'].delete()
                    print(res)
                except Exception as e:
                    print(e)

            elif command_name == 'reindex':
                try:
                    posts = Post.objects.all()
                    
                    for post in posts:
                        document = {
                            'id': str(post.id),
                            'title': str(post.title),
                            'content': str(post.content),
                            'summary': str(post.summary),
                            'url': str(post.url)
                        }
                        res = client.collections['posts'].documents.upsert(
                            document)
                        print(post.id)
                        
                except Exception as e:
                    print(e)

            elif command_name == 'summarize':
                openapi_client = OpenAI(
                  api_key=settings.OPENAI_KEY
                )

                posts = Post.objects.all()
                
                for post in posts:
                    if not post.summary:
                        try:
                            response = openapi_client.chat.completions.create(
                              model="gpt-3.5-turbo",
                              messages=[
                                {
                                  "role": "system",
                                  "content": f"Summarize this text into 240 characters or less: {post.content}"
                                },
                              ],
                              temperature=0.7,
                              max_tokens=256,
                              top_p=1
                            )
                            print(post.id)
                            print(response.choices[0].message.content)
                        
                            post.summary = response.choices[0].message.content
                            post.save()

                        # Silently swallor for now 
                        except Exception as e:
                            pass
            
        else:
            print("Typesense disconnected or error occoured")