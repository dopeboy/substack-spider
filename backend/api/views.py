import time
import requests
import re
from bs4 import BeautifulSoup

from .models import Post
from .serializers import PostSerializer
from rest_framework import viewsets
from rest_framework.response import Response


class PostViewSet(viewsets.ViewSet):
    def remove_emojis(self, string):
        emoji_pattern = re.compile(
            "["
            u"\U0001F600-\U0001F64F" # emoticons
            u"\U0001F300-\U0001F5FF" # symbols & pictographs
            u"\U0001F680-\U0001F6FF" # transport & map symbols
            u"\U0001F1E0-\U0001F1FF" # flags (iOS)
            u"\U00002702-\U000027B0"
            u"\U000024C2-\U0001F251"
            "]+", 
            flags=re.UNICODE
        )
        
        return emoji_pattern.sub(r'', string)

    # Pick a category, find all the publications in that category, 
    # and then iterate through all the posts in each publication.
    def list(self, request):
        # Substack has an ID for each category.
        # * 4 = technology
        # * 62 = business
        # * 153 = finance
        # * 118 = crypto
        # * 76741 = health 
        current_category = self.request.query_params.get('category_id')
        print(current_category)
        r = requests.get(f'https://substack.com/api/v1/category/public/{current_category}/lol?page=0')
        
        for publication in r.json()['publications']:
            if publication['language'] == 'en':
                print(publication['base_url'])

                offset = 0
                while(1):
                    r = requests.get(f'{publication["base_url"]}/api/v1/archive?offset={offset}&limit=12')
                    time.sleep(1)
                    offset += 12
                    
                    # Take the canonical URL and adjust it to hit the API
                    #
                    # eg 
                    # https://thetechbuzz.substack.com/p/x-and-draftkings-bet-on-sports
                    # =>
                    # https://thetechbuzz.substack.com/api/v1/posts/x-and-draftkings-bet-on-sports

                    r.raise_for_status()
                    resp = r.json()
                    if len(resp) == 0:
                        break
                    
                    for post in r.json():
                        # Filter out:
                        # * paid posts
                        # * posts we've already archived
                        # * crossposts
                        if (post["audience"] == "everyone" and 
                            not Post.objects.filter(url=post["canonical_url"]).exists()
                            and post["canonical_url"].find('/cp/') == -1):

                            endpoint = post['canonical_url'].replace('/p/', '/api/v1/posts/')
                            print(endpoint)
                            r = requests.get(endpoint)
                            time.sleep(1)
                            r.raise_for_status()
                            html = r.json()["body_html"]

                            if html:
                                soup = BeautifulSoup(html)
                                print(post["title"])
                                
                                # Create a post
                                Post.objects.create(
                                    title=post["title"],
                                    url=post["canonical_url"],
                                    subtitle=post["subtitle"],
                                    date_published=post["post_date"],
                                    category_id=current_category,
                                    content=self.remove_emojis(soup.get_text())
                                )
        
        queryset = Post.objects.all()[0:1]
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)