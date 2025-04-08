import os
import json
import re
from bs4 import BeautifulSoup

def generate_word_ids():
    # Read the HTML file
    html_path = os.path.join('..', 'BibleBase', 'BibleBooksHTML', 'Book-id=66-Revelation.html')
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
        word_count = 0
        
        for content in contents:
            if content.name == 'br':
                if current_verse:
                    # Extract verse number
                    match = re.match(r'^(\d+)', current_verse.strip())
                    if match:
                        verse_num = match.group(1)
                        soup_verse = BeautifulSoup(current_verse, 'html.parser')
                        
                        # Count words before red text
                        text_before_red = ''
                        for elem in soup_verse:
                            if isinstance(elem, str) or (hasattr(elem, 'class_') and 'red' not in elem.get('class', [])):
                                text_before_red += elem.get_text() if hasattr(elem, 'get_text') else str(elem)
                        
                        # Count words up to red text
                        word_count += len(text_before_red.split())
                        
                        # Find red text spans and record word IDs
                        red_spans = soup_verse.find_all('span', class_='red')
                        for span in red_spans:
                            red_text = span.get_text().strip()
                            if red_text:
                                start_id = word_count + 1
                                word_count += len(red_text.split())
                                end_id = word_count
                                
                                word_id_data[chapter_num].append({
                                    'verse': verse_num,
                                    'start': start_id,
                                    'end': end_id
                                })
                            
                            # Count any non-red text between red spans
                            next_sibling = span.next_sibling
                            if next_sibling and isinstance(next_sibling, str):
                                word_count += len(next_sibling.strip().split())
                                
                current_verse = ''
            else:
                current_verse += str(content)
    
    # Write to JSON file
    output_path = os.path.join('..', 'json', 'revelation-red-letter-ids.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(word_id_data, f, indent=2)

if __name__ == '__main__':
    generate_word_ids()