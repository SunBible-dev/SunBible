import os
import json
import re
from bs4 import BeautifulSoup

def generate_word_ids():
    # Read the HTML file
    html_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'BibleBase', 'BibleBooksHTML', 'Book-id=66-Revelation.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Parse HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find all chapters
    chapters = soup.find_all('div', class_='Chapter')
    
    word_id_data = {}
    
    for chapter in chapters:
        chapter_id = chapter.get('id')
        if not chapter_id:
            continue
            
        chapter_num = re.search(r'\d+', chapter_id).group()
        word_id_data[chapter_num] = []
        
        # Get all text nodes and br tags
        contents = chapter.contents
        current_verse = ''
        verse_num = ''
        
        for content in contents:
            if content.name == 'br':
                if current_verse:
                    # Extract verse number
                    match = re.match(r'^(\d+)', current_verse.strip())
                    if match:
                        verse_num = match.group(1)
                        soup_verse = BeautifulSoup(current_verse, 'html.parser')
                        
                        # Find red text spans and record word IDs
                        red_spans = soup_verse.find_all('span', class_='red')
                        for span in red_spans:
                            red_text = span.get_text().strip()
                            if red_text:
                                words = red_text.split()
                                word_id_data[chapter_num].append({
                                    'verse': verse_num,
                                    'word_ids': f'1-{len(words)}'
                                })
                                
                current_verse = ''
            else:
                current_verse += str(content)
    
    # Write to JSON file
    output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'json', 'revelation-red-letter-ids.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(word_id_data, f, indent=2)

if __name__ == '__main__':
    generate_word_ids()