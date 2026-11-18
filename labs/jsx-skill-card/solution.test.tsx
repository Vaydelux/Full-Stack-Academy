import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SkillCard } from './solution/SkillCard';

test('SkillCard renders typed props with the correct list length and order', () => {
  const html = renderToStaticMarkup(createElement(SkillCard, {
    title: 'Frontend foundations',
    level: 'Beginner',
    skills: [
      { id: 'ts', label: 'TypeScript' },
      { id: 'jsx', label: 'JSX' },
      { id: 'react', label: 'React' },
    ],
  }));
  assert.match(html, /<article aria-label="Frontend foundations">/);
  assert.match(html, /<h2>Frontend foundations<\/h2>/);
  assert.match(html, /<p>Beginner<\/p>/);
  assert.equal((html.match(/<li>/g) ?? []).length, 3);
  assert.ok(html.indexOf('TypeScript') < html.indexOf('JSX'));
  assert.ok(html.indexOf('JSX') < html.indexOf('React'));
});

test('SkillCard provides a semantic empty state and does not invent list items', () => {
  const html = renderToStaticMarkup(createElement(SkillCard, {
    title: 'No skills yet', level: 'New', skills: [],
  }));
  assert.match(html, /role="status"/);
  assert.match(html, /No skills have been added/);
  assert.doesNotMatch(html, /<li>/);
});

test('SkillCard escapes untrusted display text through React rendering', () => {
  const html = renderToStaticMarkup(createElement(SkillCard, {
    title: '<script>alert(1)</script>', level: 'Security', skills: [
      { id: 'x', label: '<img src=x onerror=alert(1)>' },
    ],
  }));
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;img/);
});
