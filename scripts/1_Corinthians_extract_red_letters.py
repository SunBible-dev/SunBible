from bs4 import BeautifulSoup
import json
import re

def extract_red_letters(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    chapters = soup.find_all('div', class_='PaulBookChapter')
    print(f"Found {len(chapters)} chapters")
    
    words_output = {"1Corinthians": []}
    
    for chapter in chapters:
        chapter_num = chapter.find('h1').text.split()[1]
        print(f"Processing chapter {chapter_num}")
        
        chapter_words = {"chapter": chapter_num, "verses": []}
        
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
            
            # Get verse number and text
            verse_text = ''.join(text for text, _ in verse_content)
            verse_match = re.match(r'\s*(\d+)\s', verse_text)
            if not verse_match:
                continue
            verse_num = verse_match.group(1)
            
            # Extract red letter words
            red_words = []
            for text, is_red in verse_content:
                if is_red:
                    words = text.strip()
                    if words:
                        red_words.append(words)
            
            if red_words:
                chapter_words["verses"].append({
                    "verse": verse_num,
                    "red_words": " ".join(red_words)
                })
        
        if chapter_words["verses"]:
            words_output["1Corinthians"].append(chapter_words)
    
    return words_output

def main():
    import os
    print("Starting red letter extraction...")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    html_file = os.path.join(project_root, 'BibleBase', 'BibleBooksHTML', 'Book-id=46-1Corinthians.html')
    words_output_file = os.path.join(project_root, 'json', '1Corinthians-red-letter.json')
    
    words_output = extract_red_letters(html_file)
    
    with open(words_output_file, 'w', encoding='utf-8') as f:
        json.dump(words_output, f, indent=2)

if __name__ == '__main__':
    main()