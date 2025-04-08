import os
import json
import re
from bs4 import BeautifulSoup

def extract_red_letters():
    # Read the HTML file
    html_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'BibleBase', 'BibleBooksHTML', 'Book-id=66-Revelation.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Parse HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find all chapters
    chapters = soup.find_all('div', class_='Chapter')
    
    red_letter_data = {}
    
    for chapter in chapters:
        chapter_id = chapter.get('id')
        if not chapter_id:
            continue
            
        chapter_num = re.search(r'\d+', chapter_id).group()
        red_letter_data[chapter_num] = []
        
        # Get all text nodes and br tags
        contents = chapter.contents
        current_verse = ''
        verse_num = ''
        red_text = ''
        
        for content in contents:
            if content.name == 'br':
                # Extract verse number
                if current_verse:
                    match = re.match(r'^(\d+)', current_verse.strip())
                    if match:
                        verse_num = match.group(1)
                        # Find red text spans
                        red_spans = BeautifulSoup(current_verse, 'html.parser').find_all('span', class_='red')
                        if red_spans:
                            red_text = ' '.join(span.get_text().strip() for span in red_spans)
                            if red_text:
                                red_letter_data[chapter_num].append({
                                    'verse': verse_num,
                                    'text': red_text
                                })
                current_verse = ''
            else:
                current_verse += str(content)
    
    # Write to JSON file
    output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'json', 'revelation-red-letter.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(red_letter_data, f, indent=2)

if __name__ == '__main__':
    extract_red_letters()