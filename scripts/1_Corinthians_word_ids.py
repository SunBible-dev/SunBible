from bs4 import BeautifulSoup
import json
import re

def get_word_ids(text, start_pos):
    """Get word positions in a verse"""
    words = text.split()
    return f"{start_pos}-{start_pos + len(words) - 1}"

def process_matthew():
    import os
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    html_file = os.path.join(project_root, 'BibleBase', 'BibleBooksHTML', 'Book-id=46-1Corinthians.html')
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    chapters = soup.find_all('div', class_='PaulBookChapter')
    
    output = {"1Corinthians": []}
    
    for chapter in chapters:
        chapter_num = chapter.find('h1').text.split()[1]
        chapter_data = {"chapter": chapter_num, "verses": []}
        
        # Split chapter content into verses
        verse_elements = []
        current_verse = []
        for element in chapter.children:
            if isinstance(element, str):
                current_verse.append((element, False))
            elif element.name == 'br':
                if current_verse:
                    verse_elements.append(current_verse)
                current_verse = []
            elif element.name == 'span' and 'red' in element.get('class', []):
                current_verse.append((element.text, True))
        if current_verse:
            verse_elements.append(current_verse)
        
        # Process each verse
        for verse_content in verse_elements:
            if not verse_content:
                continue
            
            # Get verse number
            verse_text = ''.join(text for text, _ in verse_content)
            verse_match = re.match(r'\s*(\d+)\s', verse_text)
            if not verse_match:
                continue
            verse_num = verse_match.group(1)
            
            # Count words and identify red letter ranges
            word_count = 0
            # Skip verse number in word count
            first_text = verse_content[0][0].strip()
            if first_text.split()[0].isdigit():
                word_count -= 1
            
            for text, is_red in verse_content:
                words = text.strip().split()
                if is_red:
                    word_ids = get_word_ids(text, word_count + 1)
                    chapter_data["verses"].append({
                        "verse": verse_num,
                        "word_ids": word_ids
                    })
                word_count += len(words)
        
        if chapter_data["verses"]:
            output["1Corinthians"].append(chapter_data)
    
    # Save the output
    output_file = os.path.join(project_root, 'json', '1Corinthians-red-letter-ids.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)

if __name__ == '__main__':
    process_matthew()