from bs4 import BeautifulSoup
import json
import re

def extract_red_letters(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    chapters = soup.find_all('div', id=re.compile('^Chapter\d+$'))
    
    matthew_data = []
    
    for chapter in chapters:
        chapter_num = chapter.find('h1', id='ChapterNumber').text.split()[1]
        verse_texts = chapter.get_text().split('\n')
        
        current_verse = None
        red_letters = []
        
        # Find all red spans in the chapter
        red_spans = chapter.find_all('span', class_='red')
        
        # Process each line to find verse numbers
        for text in verse_texts:
            text = text.strip()
            if not text:
                continue
                
            # Check if this line starts with a verse number
            if text[0].isdigit() and ' ' in text:
                verse_num = text.split()[0]
                if verse_num.isdigit():
                    # Save previous verse if it had red letters
                    if current_verse and red_letters:
                        matthew_data.append({
                            "chapter": chapter_num,
                            "verse": current_verse,
                            "red_words": ' '.join(red_letters)
                        })
                    current_verse = verse_num
                    red_letters = []
                    
                    # Find red spans that belong to this verse
                    for span in red_spans:
                        # Check if this span's text appears in the current verse text
                        span_text = span.get_text().strip()
                        if span_text in text:
                            red_letters.append(span_text)
        
        # Add the last verse of the chapter if it has red letters
        if current_verse and red_letters:
            matthew_data.append({
                "chapter": chapter_num,
                "verse": current_verse,
                "red_words": ' '.join(red_letters)
            })
        
        # Add the last verse of the chapter
        if current_verse and red_letters:
            matthew_data.append({
                "chapter": chapter_num,
                "verse": current_verse,
                "red_words": ' '.join(red_letters)
            })
    
    return matthew_data

def main():
    import os
    
    # Get the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Use relative paths from project root
    html_file = os.path.join(project_root, 'BibleBase', 'BibleBooksHTML', 'Book-id=40-Matthew.html')
    output_file = os.path.join(project_root, 'json', 'matthew-red-letter.json')
    
    matthew_data = extract_red_letters(html_file)
    
    output = {
        "Matthew": matthew_data
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)

if __name__ == '__main__':
    main()