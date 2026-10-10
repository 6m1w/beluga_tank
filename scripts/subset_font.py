"""Rebuild fonts/xique-song.woff2 with only the characters the page uses.

Run after changing any copy in index.html or the aquarium data in app.js:

    pip install fonttools brotli
    python scripts/subset_font.py [path/to/喜鹊宋体简繁版.ttf]

The source font is commercial (licensed) and is NOT committed; only the subset is.
"""
import os
import re
import sys

from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/Library/Fonts/喜鹊宋体简繁版.ttf')
OUTPUT = os.path.join(ROOT, 'fonts', 'xique-song.woff2')

html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
js = open(os.path.join(ROOT, 'app.js'), encoding='utf-8').read()

# Visible page text, plus strings app.js writes into the page (aquarium names, info rows)
text = re.sub(r'<[^>]+>', '', html[html.index('<body'):])
text += ''.join(re.findall(r'["\'`]([^"\'`]*[⺀-￿][^"\'`]*)["\'`]', js))
text += '0123456789.,%m×'

chars = ''.join(sorted(set(text) - set('\n\r\t')))
options = subset.Options()
options.flavor = 'woff2'
options.layout_features = ['*']
font = subset.load_font(SOURCE, options)
subsetter = subset.Subsetter(options)
subsetter.populate(text=chars)
subsetter.subset(font)
subset.save_font(font, OUTPUT, options)
print(f'{len(chars)} characters -> {OUTPUT} ({os.path.getsize(OUTPUT) // 1024} KB)')
