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
    
    html_file = os.path.join(project_root, 'BibleBase', 'BibleBooksHTML', 'Book-id=42-Luke.html')
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    chapters = soup.find_all('div', id=re.compile(r'^Chapter\d+$'))
    
    output = {"Luke": []}
    
    for chapter in chapters:
        chapter_num = chapter.find('h1', id='ChapterNumber').text.split()[1]
        chapter_data = {"chapter": chapter_num, "verses": []}
        
        # Split chapter content into verses
        verses = []
        current_verse = []
        for element in chapter.children:
            if isinstance(element, str):
                current_verse.append((element, False))
            elif element.name == 'br':
                verses.append(current_verse)
                current_verse = []
            elif element.name == 'span' and 'red' in element.get('class', []):
                current_verse.append((element.text, True))
        if current_verse:
            verses.append(current_verse)
        
        # Process each verse
        for verse_elements in verses:
            if not verse_elements:
                continue
                
            # Get verse number
            verse_text = ''.join(text for text, _ in verse_elements)
            verse_match = re.match(r'\s*(\d+)\s', verse_text)
            if not verse_match:
                continue
            verse_num = verse_match.group(1)
            
            # Count words and identify red letter ranges
            word_count = 0
            # Skip the verse number in word count
            first_text = verse_elements[0][0].strip()
            verse_words = first_text.split()
            if verse_words and verse_words[0].isdigit():
                word_count -= 1  # Subtract verse number from count
            
            for text, is_red in verse_elements:
                words = text.strip().split()
                if is_red:
                    word_ids = get_word_ids(text, word_count + 1)
                    chapter_data["verses"].append({
                        "verse": verse_num,
                        "word_ids": word_ids
                    })
                word_count += len(words)
        
        output["Luke"].append(chapter_data)
    
    # Save the output
    output_file = os.path.join(project_root, 'json', 'luke-red-letter-ids.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)

if __name__ == '__main__':
    process_matthew()