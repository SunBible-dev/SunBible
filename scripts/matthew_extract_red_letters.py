from bs4 import BeautifulSoup
import json
import re
from collections import defaultdict

def get_word_id_ranges(word_ids):
    if not word_ids:
        return ""
    
    # Convert string IDs to integers for proper sorting
    nums = []
    for wid in word_ids:
        try:
            nums.append(int(wid))
        except ValueError:
            continue
    
    nums = sorted(nums)
    if not nums:
        return ""
    
    ranges = []
    start = nums[0]
    prev = nums[0]
    
    for num in nums[1:] + [None]:
        if num is None or num != prev + 1:
            if start == prev:
                ranges.append(str(start))
            else:
                ranges.append(f"{start}-{prev}")
            if num is not None:
                start = num
                prev = num
        else:
            prev = num
    
    return ", ".join(ranges)

def extract_red_letters(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    chapters = soup.find_all('div', id=re.compile('^Chapter\d+$'))
    
    # Initialize nested structure for chapters and verses
    words_by_chapter = defaultdict(lambda: defaultdict(list))
    ids_by_chapter = defaultdict(lambda: defaultdict(list))
    
    for chapter in chapters:
        chapter_num = chapter.find('h1', id='ChapterNumber').text.split()[1]
        
        # Find all verse spans in this chapter
        verse_spans = chapter.find_all(lambda tag: tag.name == 'span' and 
                                     tag.get('id', '').startswith(f'C{chapter_num}V'))
        
        for verse_span in verse_spans:
            # Extract verse number
            verse_num = verse_span['id'].split('V')[1]
            
            # Find all red spans within this verse
            red_spans = verse_span.find_all('span', class_='red')
            
            # Skip if no red words in this verse
            if not red_spans:
                continue
            
            # Process each red span
            verse_words = []
            verse_ids = []
            
            for span in red_spans:
                word = span.get_text().strip()
                if word and 'id' in span.attrs:
                    word_id = span['id'].split('W')[1]
                    verse_words.append(word)
                    verse_ids.append(word_id)
            
            if verse_words:
                words_by_chapter[chapter_num][verse_num].extend(verse_words)
                ids_by_chapter[chapter_num][verse_num].extend(verse_ids)
    
    # Convert defaultdict to regular dict for JSON serialization
    words_output = {"Matthew": []}
    ids_output = {"Matthew": []}
    
    for chapter_num in sorted(words_by_chapter.keys(), key=int):
        chapter_words = {
            "chapter": chapter_num,
            "verses": []
        }
        chapter_ids = {
            "chapter": chapter_num,
            "verses": []
        }
        
        for verse_num in sorted(words_by_chapter[chapter_num].keys(), key=int):
            verse_words = {
                "verse": verse_num,
                "red_words": " ".join(words_by_chapter[chapter_num][verse_num])
            }
            verse_ids = {
                "verse": verse_num,
                "word_ids": get_word_id_ranges(ids_by_chapter[chapter_num][verse_num])
            }
            
            chapter_words["verses"].append(verse_words)
            chapter_ids["verses"].append(verse_ids)
        
        words_output["Matthew"].append(chapter_words)
        ids_output["Matthew"].append(chapter_ids)
    
    return words_output, ids_output

def main():
    import os
    
    # Get the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Use relative paths from project root
    html_file = os.path.join(project_root, 'BibleBase', 'BibleBooksHTML', 'Book-id=40-Matthew.html')
    words_output_file = os.path.join(project_root, 'json', 'matthew-red-letter.json')
    ids_output_file = os.path.join(project_root, 'json', 'matthew-red-letter-ids.json')
    
    words_output, ids_output = extract_red_letters(html_file)
    
    # Write the words output
    with open(words_output_file, 'w', encoding='utf-8') as f:
        json.dump(words_output, f, indent=2)
    
    # Write the IDs output
    with open(ids_output_file, 'w', encoding='utf-8') as f:
        json.dump(ids_output, f, indent=2)

if __name__ == '__main__':
    main()