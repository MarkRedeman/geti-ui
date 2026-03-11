import {
    parseSectionsFromMarkdown,
    extractNameAndDescription,
    extractComponentProps,
    extractPropsTable,
} from './parser';

describe('parseSectionsFromMarkdown', () => {
    test('extracts sections from ## headings', () => {
        const lines = ['# Title', '', '## Section A', 'content a', '', '## Section B', 'content b'];
        const sections = parseSectionsFromMarkdown(lines);

        expect(sections).toHaveLength(2);
        expect(sections[0].name).toBe('Section A');
        expect(sections[0].startLine).toBe(2);
        expect(sections[0].endLine).toBe(5);
        expect(sections[1].name).toBe('Section B');
        expect(sections[1].startLine).toBe(5);
        expect(sections[1].endLine).toBe(lines.length);
    });

    test('returns empty array when no ## headings', () => {
        const lines = ['# Title', 'Just a paragraph.'];
        expect(parseSectionsFromMarkdown(lines)).toEqual([]);
    });

    test('ignores headings inside fenced code blocks', () => {
        const lines = ['## Real', '', '```', '## Fake', '```', '', '## Also Real'];
        const sections = parseSectionsFromMarkdown(lines);

        expect(sections).toHaveLength(2);
        expect(sections[0].name).toBe('Real');
        expect(sections[1].name).toBe('Also Real');
    });

    test('handles single section spanning to end of file', () => {
        const lines = ['## Only', 'line 1', 'line 2'];
        const sections = parseSectionsFromMarkdown(lines);

        expect(sections).toHaveLength(1);
        expect(sections[0].startLine).toBe(0);
        expect(sections[0].endLine).toBe(3);
    });
});

describe('extractNameAndDescription', () => {
    test('extracts name from first # heading', () => {
        const lines = ['# Button', '', 'A clickable button component.'];
        const result = extractNameAndDescription(lines);

        expect(result.name).toBe('Button');
        expect(result.description).toBe('A clickable button component.');
    });

    test('extracts multi-line description paragraph', () => {
        const lines = ['# Chart', '', 'First line of description.', 'Second line of description.', '', 'Next para.'];
        const result = extractNameAndDescription(lines);

        expect(result.name).toBe('Chart');
        expect(result.description).toBe('First line of description.\nSecond line of description.');
    });

    test('returns empty name and undefined description for empty input', () => {
        const result = extractNameAndDescription([]);

        expect(result.name).toBe('');
        expect(result.description).toBeUndefined();
    });

    test('skips sub-headings when looking for description', () => {
        const lines = ['# Title', '', '## Sub-heading', '', 'Actual description.'];
        const result = extractNameAndDescription(lines);

        expect(result.name).toBe('Title');
        expect(result.description).toBe('Actual description.');
    });

    test('skips HTML tags when looking for description', () => {
        const lines = ['# Title', '', '<div>', 'Actual description.'];
        const result = extractNameAndDescription(lines);

        expect(result.name).toBe('Title');
        expect(result.description).toBe('Actual description.');
    });

    test('ignores code blocks in description', () => {
        const lines = ['# Title', '', '```', '# not a heading', '```', '', 'Real description.'];
        const result = extractNameAndDescription(lines);

        expect(result.name).toBe('Title');
        expect(result.description).toBe('Real description.');
    });
});

describe('extractComponentProps', () => {
    test('extracts props grouped by category', () => {
        const lines = [
            '# Button',
            '',
            '## Props (deep dive)',
            '',
            '### Appearance',
            '',
            '* `variant`: The visual style of the button.',
            '* `size`: The size of the button.',
            '',
            '### Behavior',
            '',
            '* `onPress`: Handler called when the button is pressed.',
            '',
            '## Examples',
        ];

        const result = extractComponentProps(lines);

        expect(Object.keys(result)).toEqual(['Appearance', 'Behavior']);
        expect(result['Appearance']).toHaveLength(2);
        expect(result['Appearance'][0]).toEqual({
            name: 'variant',
            description: 'The visual style of the button.',
        });
        expect(result['Appearance'][1]).toEqual({
            name: 'size',
            description: 'The size of the button.',
        });
        expect(result['Behavior']).toHaveLength(1);
        expect(result['Behavior'][0]).toEqual({
            name: 'onPress',
            description: 'Handler called when the button is pressed.',
        });
    });

    test('returns empty object when no Props section exists', () => {
        const lines = ['# Button', '', '## Examples', '', 'Some examples here.'];
        expect(extractComponentProps(lines)).toEqual({});
    });

    test('stops at next ## heading after Props section', () => {
        const lines = ['## Props', '### Cat', '* `a`: desc a.', '## Not Props', '### Other', '* `b`: desc b.'];

        const result = extractComponentProps(lines);

        expect(Object.keys(result)).toEqual(['Cat']);
        expect(result['Cat']).toHaveLength(1);
    });

    test('ignores props inside code blocks', () => {
        const lines = ['## Props', '### Cat', '```', '* `fake`: not real.', '```', '* `real`: yes.'];

        const result = extractComponentProps(lines);

        expect(result['Cat']).toHaveLength(1);
        expect(result['Cat'][0].name).toBe('real');
    });
});

describe('extractPropsTable', () => {
    test('extracts props from a markdown table', () => {
        const lines = [
            '| Prop | Type | Default | Description |',
            '| --- | --- | --- | --- |',
            '| `width` | `number` | `100` | The width in pixels. |',
            '| `height` | `number` | - | The height in pixels. |',
        ];

        const result = extractPropsTable(lines);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            name: 'width',
            description: 'The width in pixels.',
            type: 'number',
            defaultValue: '100',
        });
        expect(result[1]).toEqual({
            name: 'height',
            description: 'The height in pixels.',
            type: 'number',
            defaultValue: undefined,
        });
    });

    test('returns empty array when no table present', () => {
        const lines = ['# Title', '', 'No table here.'];
        expect(extractPropsTable(lines)).toEqual([]);
    });

    test('stops parsing at non-table content', () => {
        const lines = [
            '| Prop | Type | Default | Description |',
            '| --- | --- | --- |',
            '| `a` | `string` | - | First prop. |',
            '',
            'Some text after table.',
            '| `b` | `string` | - | Should not be parsed. |',
        ];

        const result = extractPropsTable(lines);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('a');
    });

    test('handles table with only Prop and Type columns', () => {
        const lines = ['| Prop | Type |', '| --- | --- |', '| `color` | `string` |'];

        const result = extractPropsTable(lines);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            name: 'color',
            description: '',
            type: 'string',
            defaultValue: undefined,
        });
    });
});
