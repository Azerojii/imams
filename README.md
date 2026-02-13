# WikiClone

A high-performance, SEO-friendly Wikipedia clone built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js App Router** - Modern React framework with server components
- 📝 **Markdown Support** - Write articles in Markdown with frontmatter metadata
- 🔗 **WikiLinks** - Internal linking with `[[Article Name]]` syntax
- 🔍 **Full-Text Search** - Fast search powered by Fuse.js
- 📑 **Table of Contents** - Auto-generated from article headers
- 📦 **Infoboxes** - Structured data display for key facts
- 🎨 **Wikipedia-inspired Design** - Clean, minimalist interface
- ♿ **Accessibility** - Semantic HTML and keyboard navigation
- 📱 **Responsive** - Works on all device sizes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wikipedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
wikipedia/
├── content/
│   └── wiki/              # Markdown articles
│       ├── Next_js.md
│       ├── React.md
│       └── ...
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── search/    # Search API endpoint
│   │   ├── wiki/
│   │   │   └── [slug]/    # Dynamic wiki pages
│   │   ├── layout.tsx
│   │   ├── page.tsx       # Home page
│   │   └── globals.css
│   ├── components/
│   │   ├── WikiHeader.tsx
│   │   ├── WikiSidebar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TableOfContents.tsx
│   │   └── Infobox.tsx
│   └── lib/
│       └── wiki.ts        # Wiki utilities and parsers
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Creating Articles

### Article Format

Articles are written in Markdown with YAML frontmatter:

```markdown
---
title: "Article Title"
description: "Brief description"
lastUpdated: "2026-01-02"
category: "Category Name"
infobox:
  type: "Type"
  developer: "Developer Name"
  initial_release: "Date"
  license: "License Type"
---

# Article Title

Your article content here...

## Section Heading

More content...

### Subsection

Even more content...

## See Also

- [[Related Article 1]]
- [[Related Article 2]]

## References

1. Reference 1
2. Reference 2
```

### WikiLinks

Use double brackets to create internal links:

```markdown
[[Next.js]]  →  Converts to link: /wiki/Next_js
[[React]]    →  Converts to link: /wiki/React
```

The WikiLink parser uses the regex pattern: `/\[\[(.*?)\]\]/g`

### Adding New Articles

1. Create a new `.md` file in `content/wiki/`
2. Use underscores for spaces in filename (e.g., `New_Article.md`)
3. Add frontmatter metadata
4. Write your content using Markdown
5. The article will be automatically available at `/wiki/New_Article`

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Markdown**: remark, remark-html, gray-matter
- **Search**: Fuse.js
- **Icons**: Lucide React

## Key Features Explained

### Dynamic Routing

The app uses Next.js App Router with dynamic routes (`[slug]`). Each markdown file in `content/wiki/` automatically becomes a route.

### Server-Side Rendering

Articles are rendered on the server for optimal performance and SEO. The `getWikiArticle` function processes markdown at request time.

### WikiLink Parser

The custom WikiLink parser converts `[[Article Name]]` to proper Next.js links:

```typescript
export function parseWikiLinks(content: string): string {
  return content.replace(/\[\[(.*?)\]\]/g, (match, articleName) => {
    const slug = articleName.trim().replace(/\s+/g, '_')
    return `[${articleName}](/wiki/${slug})`
  })
}
```

### Search Functionality

Search is powered by Fuse.js with fuzzy matching across:
- Article titles
- Descriptions
- Categories

### Table of Contents

Automatically generated from `h2` and `h3` headers with anchor links for easy navigation.

## Customization

### Styling

Edit `tailwind.config.js` to customize colors and theme:

```javascript
theme: {
  extend: {
    colors: {
      'wiki-blue': '#0645ad',
      'wiki-blue-visited': '#0b0080',
      // Add your custom colors
    },
  },
}
```

### Infobox Fields

Customize infobox data in article frontmatter:

```yaml
infobox:
  custom_field: "Custom Value"
  another_field: "Another Value"
```

## Build for Production

```bash
npm run build
npm run start
```

The app will be optimized for production with:
- Static page generation for all articles
- Optimized images and assets
- Minified CSS and JavaScript

## License

MIT License - Feel free to use this project for your own wiki!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Inspired by Wikipedia's design and functionality
- Built with modern web technologies for optimal performance
