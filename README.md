# CV Fluency Builder

A modern, AI-powered CV builder that helps you create professional resumes tailored to specific job descriptions. Built with React, TypeScript, and OpenAI integration.

## ✨ Features

### 🤖 AI-Powered CV Generation
- **Structured CV Generation**: Traditional formatted CVs with detailed analysis
- **HTML CV Generation**: Professional HTML resumes with modern styling
- **Job Description Analysis**: Tailors your CV to match specific job requirements
- **Smart Content Prioritization**: Reorders and emphasizes relevant experience
- **Skill Categorization**: Automatically categorizes skills by relevance

### 📄 Multiple Output Formats
- **Structured CV Preview**: Interactive preview with analysis
- **HTML Resume**: Professional HTML with inline CSS styling
- **PDF Export**: Download as PDF with proper formatting
- **HTML Download**: Save as standalone HTML file
- **New Tab Preview**: Open in new browser tab for full view

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching
- **RTL Support**: Full right-to-left language support
- **Real-time Preview**: See changes as you type
- **Drag & Drop**: Easy file upload for existing CVs

### 🔧 Developer Features
- **TypeScript**: Full type safety
- **Component Library**: Built with shadcn/ui
- **State Management**: Efficient React state handling
- **Error Handling**: Comprehensive error management
- **Mock Services**: Development without API keys

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cv-fluency-builder.git
   cd cv-fluency-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Creating Your First CV

1. **Navigate to the Builder**
   - Go to `/builder` or click "Start Building" on the landing page

2. **Choose CV Generation Type**
   - **Structured CV**: Traditional formatted CV with detailed analysis
   - **HTML CV**: Professional HTML resume with modern styling

3. **Enter Job Description**
   - Paste or type the job description you're applying for
   - The AI will analyze requirements and tailor your CV accordingly

4. **Input Your CV**
   - Paste your existing CV content
   - Or upload a file (PDF, DOCX, TXT supported)
   - Use raw, unstructured format - the AI will organize it

5. **Generate Your CV**
   - Click "Generate CV" or "Generate HTML CV"
   - Wait for AI processing (usually 10-30 seconds)

6. **Preview and Export**
   - Review the generated CV in the preview
   - Check the analysis for match score and suggestions
   - Export as PDF, download HTML, or open in new tab

### HTML CV Generation

The HTML CV feature generates professional, standalone HTML resumes with:

- **Modern Design**: Clean, professional styling with inline CSS
- **Responsive Layout**: Works on all screen sizes
- **Semantic HTML**: Proper HTML5 structure
- **Developer Focus**: Emphasizes technical skills and projects
- **Multiple Export Options**: PDF, HTML download, new tab preview

#### HTML CV Features:
- ✅ Professional typography and spacing
- ✅ Color-coded skill categories
- ✅ Responsive design
- ✅ Print-friendly styling
- ✅ SEO-optimized structure
- ✅ Cross-browser compatibility

### File Upload Support

Supported file formats:
- **PDF**: Extracts text content
- **DOCX**: Microsoft Word documents
- **TXT**: Plain text files
- **RTF**: Rich text format

### Export Options

#### Structured CV:
- PDF export with proper formatting
- Print-friendly layout
- High-quality output

#### HTML CV:
- **Download HTML**: Standalone HTML file
- **Export PDF**: Convert to PDF using html2pdf.js
- **Open in Tab**: Full browser preview
- **Print**: Browser print function

## 🛠 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/            # shadcn/ui components
│   ├── CVPreview.tsx  # Structured CV preview
│   ├── HTMLCVPreview.tsx # HTML CV preview
│   └── ...
├── services/           # Business logic
│   ├── aiService.ts   # OpenAI integration
│   ├── htmlCvService.ts # HTML CV generation
│   ├── htmlPdfExport.ts # HTML to PDF export
│   └── ...
├── pages/             # Page components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── types/             # TypeScript types
└── ...
```

### Key Technologies

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: shadcn/ui, Tailwind CSS
- **AI Integration**: OpenAI GPT-4
- **PDF Export**: html2pdf.js
- **File Processing**: pdf-parse, mammoth
- **Security**: DOMPurify for HTML sanitization

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Variables

```env
# Required for AI features
VITE_OPENAI_API_KEY=your_openai_api_key

# Optional: Custom API endpoint
VITE_OPENAI_API_URL=https://api.openai.com/v1
```

## 🔧 Configuration

### Customizing the AI Prompt

Edit the prompt in `src/services/htmlCvService.ts` to customize:
- CV structure and formatting
- Skill categorization
- Experience prioritization
- Styling preferences

### Adding New Export Formats

1. Create a new service in `src/services/`
2. Implement export methods
3. Add UI components for the new format
4. Update the preview components

### Styling Customization

The app uses Tailwind CSS with a custom design system:
- Edit `src/index.css` for global styles
- Modify `tailwind.config.ts` for theme customization
- Update component styles in individual files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code formatting
- Add proper error handling
- Include TypeScript types for all functions
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for fast development

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/cv-fluency-builder/issues) page
2. Create a new issue with detailed information
3. Include your browser, OS, and steps to reproduce

---

**Made with ❤️ for developers and job seekers**
