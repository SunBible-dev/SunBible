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
        verses = chapter.find_all(True)
        
        current_verse = None
        red_letters = []
        
        for verse in verses:
            text = verse.get_text().strip()
            if text and text[0].isdigit() and ' ' in text:
                # This looks like a verse number
                verse_num = text.split()[0]
                if verse_num.isdigit():
                    if current_verse and red_letters:
                        matthew_data.append({
                            "chapter": chapter_num,
                            "verse": current_verse,
                            "red_words": ' '.join(red_letters)
                        })
                    current_verse = verse_num
                    red_letters = []
            
            red_spans = verse.find_all('span', class_='red')
            for span in red_spans:
                words = span.get_text().strip()
                if words:
                    red_letters.append(words)
        
        # Add the last verse of the chapter
        if current_verse and red_letters:
            matthew_data.append({
                "chapter": chapter_num,
                "verse": current_verse,
                "red_words": ' '.join(red_letters)
            })
    
    return matthew_data

def main():
    html_file = '/Volumes/DEV/DEV_VOLUME/SunBible/BibleBase/BibleBooksHTML/Book-id=40-Matthew.html'
    output_file = '/Volumes/DEV/DEV_VOLUME/SunBible/json/matthew-red-letter.json'
    
    matthew_data = extract_red_letters(html_file)
    
    output = {
        "Matthew": matthew_data
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)

if __name__ == '__main__':
    main()