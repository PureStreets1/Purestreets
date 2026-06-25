from pathlib import Path

root = Path('.')
paths = list(root.glob('*.html')) + list(root.glob('*.css')) + list(root.glob('*.js'))
changed = []
for path in paths:
    text = path.read_text(encoding='utf-8')
    orig = text
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    text = '\n'.join(line.rstrip() for line in text.split('\n'))
    text = text.rstrip('\n') + '\n'
    if text != orig:
        path.write_text(text, encoding='utf-8')
        changed.append(str(path))
print('fixed', len(changed), 'files')
for p in changed:
    print(p)
