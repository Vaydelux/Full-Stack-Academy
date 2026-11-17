# 06.01.01 — JSX: Describe a UI without manually building the DOM

*React 19 · 30–45 minutes editorial estimate · Beginner · Original authored sample lesson draft*

## The problem we're solving

Suppose you're building a list of teammates. You could create every `<li>` element with `document.createElement()`, set its content, and append it manually. That works, but now every change to the list requires more DOM bookkeeping. React gives you a way to **describe what the UI should look like from data**. JSX is the syntax that makes those descriptions readable.

JSX resembles HTML, but it isn't an HTML string. A build tool transforms it into JavaScript calls that React uses to describe elements. Modern projects commonly use the automatic JSX runtime rather than requiring an explicit `React.createElement(...)` in your source.

## What you'll learn

1. Explain JSX's role in the build/render pipeline.
2. Return valid JSX from a component.
3. Embed JavaScript expressions using single curly braces.
4. Render a list of data with stable keys.
5. Recognize `className`, `htmlFor`, and the `style` object convention.

## Mental model

```text
Your component returns JSX
        ↓ build transformation
JavaScript instructions for React
        ↓ React reconciles and commits
Browser DOM is updated
```

**Predict first:** What does `{2 + 3}` show inside a paragraph? `5`, because the braces contain a JavaScript expression. Why is `{{ color: 'red' }}` different? The outer braces enter JavaScript; the inner ones create a JavaScript object value.

## Step 1 — Start with a component

In a Vite + React TypeScript starter, create `src/components/TeamCard.tsx`:

```tsx
export function TeamCard() {
  return (
    <article>
      <h2>Engineering team</h2>
      <p>People who build the product.</p>
    </article>
  );
}
```

Import and render `<TeamCard />` from your application's root component. **Expected:** An article with a heading and paragraph.

## Step 2 — Insert JavaScript expressions

```tsx
export function TeamCard() {
  const teamName = 'Platform Crew';
  const members = 4;
  return (
    <article>
      <h2>{teamName}</h2>
      <p>{members} people contribute.</p>
      <p>{members >= 5 ? 'Large team' : 'Small team'}</p>
    </article>
  );
}
```

**Expected:** “Platform Crew”, “4 people contribute”, and “Small team”. What changes if `members` becomes 7?

## Step 3 — Render data safely and predictably

```tsx
const people = [
  { id: 'p-1', name: 'Ava' },
  { id: 'p-2', name: 'Noel' },
];

export function TeamCard() {
  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>{person.name}</li>
      ))}
    </ul>
  );
}
```

**Why keys matter:** React needs stable identity when items are inserted, reordered or removed. An array index is not a good key when list order can change.

## Step 4 — Learn the JSX differences from HTML

```tsx
export function SampleForm() {
  return (
    <div className="form-field">
      <label htmlFor="display-name">Display name</label>
      <input id="display-name" style={{ borderRadius: 8 }} />
    </div>
  );
}
```

Notice `className` and `htmlFor`, which differ from HTML attributes. The style value is a JavaScript object. JSX tags must be properly closed.

## Knowledge check

**What actually happens to JSX in a typical modern React build?**

A. The browser automatically understands JSX with no transformation.  
B. JSX is turned into React-compatible JavaScript by tooling.  
C. JSX is only a special CSS file.  
D. React simply concatenates the component source into HTML strings.

**Correct: B.** Browsers don't directly execute JSX as normal JavaScript. The compiler transforms JSX syntax into calls used by React's element runtime. React later updates the DOM.

## Guided challenge — Build a skill card

Create a `SkillCard` component with `title`, `level`, and `skills: {id,label}[]` props. It should display a heading, the level, and a semantic list of skills using `.map()`.

**Rubric:**

- [ ] All JSX is properly closed and returned from one component.
- [ ] Data is rendered using expressions rather than hardcoded text.
- [ ] Skill list uses stable IDs as keys.
- [ ] `className` and `htmlFor` are used correctly when applicable.
- [ ] Vite/TypeScript build passes in the starter project.

**Hint 1:** Use an interface for props. **Hint 2:** `skills.map(skill => <li key={skill.id}>{skill.label}</li>)`. **Solution:** Compose the list inside `<ul>`, not directly as a string.

## Bug Hunt Arena — The disappearing input value

A teammate renders inputs in an array with `key={index}`. When the user reorders the list, text appears beside the wrong label.

**Diagnosis:** Index-based identity can associate state with a different item after reordering. Use a stable key from the underlying data (e.g., `skill.id`). Re-test insertion and deletion, not just the initial render.

## Reflection

JSX is a declaration of UI structure. In what way is that different from manually creating and mutating DOM nodes yourself?

## Completion gate

- Correct knowledge-check answer.
- Built the skill card from data.
- Demonstrated why keys should be stable under reordering.
- Verified build using the pinned starter repo (when published).

**Official references:** [React Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx) · [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces) · [Rendering Lists](https://react.dev/learn/rendering-lists).
