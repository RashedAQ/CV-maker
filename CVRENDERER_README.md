# CVRenderer Component

A modern, clean CV renderer component that matches the professional design from your HTML template.

## Features

- **Clean, Professional Design**: Matches the exact styling from your HTML template
- **Responsive Layout**: Works on desktop and mobile devices
- **Skill Categorization**: Automatically categorizes skills by relevance (core, relevant, additional, technical, soft, language, tool)
- **Visual Skill Levels**: Color-coded skill levels with dots (beginner, intermediate, advanced, expert)
- **Modern Icons**: Uses Lucide React icons for contact information
- **Tailwind CSS**: Built with Tailwind CSS for consistent styling
- **TypeScript**: Fully typed with TypeScript

## Usage

### Basic Usage

```tsx
import { CVRenderer } from '@/components/CVRenderer';
import { CV } from '@/types/cv';

const myCV: CV = {
  // ... your CV data
};

function MyComponent() {
  return <CVRenderer cv={myCV} />;
}
```

### With Custom Styling

```tsx
<CVRenderer cv={myCV} className="my-custom-class" />
```

## Design Features

### Header Section
- Large, centered name
- Contact information with icons
- Professional color scheme (blue-900 for headings)

### Skills Section
- **Core Skills**: Blue badges (highest priority)
- **Relevant Skills**: Green badges (medium priority)
- **Technical Skills**: Purple badges
- **Soft Skills**: Orange badges
- **Additional Skills**: Gray badges (lowest priority)
- Skill level indicators with colored dots

### Experience Section
- Left border accent for visual hierarchy
- Company and position information
- Date ranges with calendar icons
- Achievement lists
- Technology badges

### Education & Certifications
- Clean layout with institution names
- Date formatting
- GPA and relevant courses display

## Integration with CVBuilder

The CVRenderer is now integrated into the CVBuilder page with a new "Modern CV" generation type. Users can select between:

1. **Structured CV** - Traditional formatted CV
2. **HTML CV** - Professional HTML resume
3. **Modern CV** - Clean, professional design (new)

## Demo

Visit `/cv-renderer-demo` to see the component in action with sample data.

## Styling

The component uses a consistent color scheme:
- **Primary Blue**: `#0a3d62` (blue-900) for headings
- **Background**: Light gray (`#f9f9f9`) with white cards
- **Text**: Dark gray (`#222`) for readability
- **Accents**: Various colors for skill categories

## Responsive Design

- **Desktop**: Full-width layout with proper spacing
- **Mobile**: Stacked layout with appropriate margins
- **Print-friendly**: Clean design that works well for PDF export

## Dependencies

- `@/components/ui/card` - Card component for layout
- `@/components/ui/badge` - Badge component for skills
- `@/components/ui/separator` - Separator component
- `lucide-react` - Icons (Mail, Phone, MapPin, etc.)
- `@/types/cv` - TypeScript types for CV data

## Customization

You can customize the component by:

1. **Modifying colors**: Update the color functions in the component
2. **Adding new skill categories**: Extend the category mapping
3. **Changing layout**: Modify the Tailwind classes
4. **Adding new sections**: Extend the component structure

## Example Output

The component produces a clean, professional CV that looks like:

```
[ FULL NAME ]
📍 Location    ✉️ email@email.com    📞 +123 456 7890

Professional Summary
──────────────────────────────
[ Summary text... ]

Technical Skills
──────────────────────────────
🧩 Core: [React] [TypeScript] [Node.js]
🛠️ Relevant: [SQL] [Git] [Docker]
🎯 Additional: [Photoshop] [Illustrator]

Work Experience
──────────────────────────────
[ Company Name ]        [ Date Range ]
[ Position ]
• Achievement 1
• Achievement 2
[ Technologies: React, TypeScript, Node.js ]
```

This design matches the professional, clean aesthetic of modern CV templates while maintaining excellent readability and structure. 