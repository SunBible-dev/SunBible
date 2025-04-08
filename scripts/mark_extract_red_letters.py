from bs4 import BeautifulSoup
import json
import re

def extract_red_letters(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    chapters = soup.find_all('div', id=re.compile(r'^Chapter\d+$'))
    print(f"Found {len(chapters)} chapters")
    
    words_output = {"Mark": []}
    
    for chapter in chapters:
        chapter_num = chapter.find('h1', id='ChapterNumber').text.split()[1]
        print(f"Processing chapter {chapter_num}")
        
        chapter_words = {"chapter": chapter_num, "verses": []}
        
        # Get all red spans in the chapter
        red_spans = chapter.find_all('span', class_='red')
        
        # Group spans by verse
        current_verse = None
        verse_words = []
        
        for span in red_spans:
            # Find the verse number by looking at previous text
            text = ''
            node = span.previous_sibling
            while node:
                if isinstance(node, str):
                    text = node.strip() + ' ' + text
                node = node.previous_sibling
            
            # Look for verse number in the text
            verse_match = re.search(r'(\d+)\s*[^\d]*$', text)
            if verse_match:
                # If we found a new verse number, save the previous verse data
                if current_verse and verse_words:
                    chapter_words["verses"].append({
                        "verse": current_verse,
                        "red_words": " ".join(verse_words)
                    })
                
                # Start new verse
                current_verse = verse_match.group(1)
                verse_words = []
            
            # Add this span's text
            word = span.get_text().strip()
            if word:
                verse_words.append(word)
        
        # Add the last verse of the chapter
        if current_verse and verse_words:
            chapter_words["verses"].append({
                "verse": current_verse,
                "red_words": " ".join(verse_words)
            })
        
        if chapter_words["verses"]:
            words_output["Mark"].append(chapter_words)
    
    return words_output

def main():
    import os
    print("Starting red letter extraction...")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    html_file = os.path.join(project_root, 'BibleBase', 'BibleBooksHTML', 'Book-id=41-Mark.html')
    words_output_file = os.path.join(project_root, 'json', 'mark-red-letter.json')
    
    words_output = extract_red_letters(html_file)
    
    with open(words_output_file, 'w', encoding='utf-8') as f:
        json.dump(words_output, f, indent=2)

if __name__ == '__main__':
    main()