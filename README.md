# AI Code Generator

A beautiful, modern web application that helps you generate code using AI and download it as a ZIP file. The application features a dark theme and an intuitive user interface.

## Features

- 🎨 Modern dark theme interface
- 💻 AI-powered code generation
- 📋 One-click code copying
- 📦 Download generated files as ZIP
- 🔔 Toast notifications for user feedback

## Getting Started

1. Clone this repository or download the files
2. Open `index.html` in your web browser
3. Enter your coding request in the text area
4. Click "Generate Code" to get AI-generated code
5. Use the copy button to copy the code to clipboard
6. Click "Download as ZIP" to download all generated files

## Requirements

- Modern web browser with JavaScript enabled
- Internet connection for AI API access

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (ES6+)
- JSZip library for ZIP file generation
- Font Awesome for icons

## API Usage

The application uses the AI/ML API for code generation. The API key is included in the code for demonstration purposes. In a production environment, you should:

1. Store the API key securely
2. Implement proper authentication
3. Add rate limiting
4. Use environment variables for sensitive data

## Customization

You can customize the theme by modifying the CSS variables in `styles.css`:

```css
:root {
    --primary-bg: #1a1a1a;
    --secondary-bg: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --accent-color: #6c5ce7;
    --accent-hover: #8075e9;
    --error-color: #ff6b6b;
    --success-color: #51cf66;
}
```

## License

MIT License - Feel free to use this code for your own projects! 