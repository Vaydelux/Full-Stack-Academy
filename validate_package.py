from pathlib import Path
import json, subprocess

P = Path(__file__).resolve().parent
curr = json.loads((P / 'data/curriculum.json').read_text(encoding='utf-8'))
refs = json.loads((P / 'data/reference-index.json').read_text(encoding='utf-8'))['entries']
summs = json.loads((P / 'data/summary.json').read_text(encoding='utf-8'))
tracks, modules, lessons = curr['tracks'], curr['modules'], curr['lessons']

assert (len(tracks), len(modules), len(lessons), len(refs)) == (28, 111, 889, 303)
assert len(set(l['id'] for l in lessons)) == len(lessons)
assert len(set(l['slug'] for l in lessons)) == len(lessons)
assert len(set(m['id'] for m in modules)) == len(modules)
assert len(set(m['slug'] for m in modules)) == len(modules)
assert len(set(t['id'] for t in tracks)) == len(tracks)
assert len(set((r['category'], r['title']) for r in refs)) == len(refs)
assert all(l['moduleId'] in set(m['id'] for m in modules) for l in lessons)
assert all(l['trackId'] in set(t['id'] for t in tracks) for l in lessons)
assert all(sum(1 for l in lessons if l['moduleId'] == m['id']) == m['lessonCount'] for m in modules)
assert all(l['type'] in ('lab', 'debug', 'lesson') for l in lessons)
assert all(l['status'] == 'planned' for l in lessons)
assert sum(l['estimatedMinutes'] for l in lessons) == summs['planningLessonMinutes']
assert all(l['referenceUrl'].startswith('https://') for l in lessons)

for id in ['06.01.01', '07.02.01', '09.01.02', '15.02.04']:
    assert id in [l['id'] for l in lessons], f'Missing authored lesson {id}'

for x in (P / 'lessons').glob('*.md'):
    assert x.stat().st_size > 2200, x

for x in (P / 'reference').glob('*.md'):
    assert x.stat().st_size > 500, x

cat_txt = (P / 'prototype/catalog.js').read_text(encoding='utf-8')
assert cat_txt.startswith('const CATALOG = ')
cat = json.loads(cat_txt[len('const CATALOG = '):].rstrip(';\n '))
assert cat['tracks'] == tracks
assert cat['modules'] == modules
assert cat['lessons'] == lessons
assert cat['reference'] == refs

for f in ['prototype/app.js', 'prototype/catalog.js']:
    subprocess.run(['node', '--check', str(P / f)], check=True, stdout=subprocess.DEVNULL)

assert "AUTHOR_IDS = ['06.01.01'" in (P / 'prototype/app.js').read_text(encoding='utf-8')
print(
    f'PASS: {len(tracks)} tracks, {len(modules)} modules, {len(lessons)} lesson topics, {len(refs)} references, '
    + str(len(list((P / 'lessons').glob('*.md'))))
    + ' sample lessons, '
    + str(len(list((P / 'reference').glob('*.md'))))
    + ' sample reference pages; JS syntax clean'
)
