const API_KEY = 'e11d6a87ddbe4004a3bae96edc3dd591';
const API_URL = 'https://api.aimlapi.com/v1/chat/completions';

// DOM Elements
const userPrompt = document.getElementById('userPrompt');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadZip = document.getElementById('downloadZip');
const codeOutput = document.getElementById('codeOutput');

// Generated files storage
let generatedFiles = new Map();

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Copy code to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(codeOutput.textContent);
        showToast('Code copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy code', 'error');
    }
});

// Generate code using AI
async function generateCode(prompt) {
    try {
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        codeOutput.textContent = 'Generating code, please wait...';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI coding assistant. Generate code based on the user\'s request. Format your response with proper markdown code blocks using triple backticks and language identifiers. Include all necessary files and dependencies.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                stream: false,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || errorData.message || `API request failed with status ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from API');
        }

        const generatedCode = data.choices[0].message.content;
        
        // Parse the response and extract files
        const files = parseGeneratedCode(generatedCode);
        generatedFiles = new Map(Object.entries(files));
        
        // Display the main code
        codeOutput.textContent = generatedCode;
        
        // Enable download button
        downloadZip.disabled = false;
        showToast('Code generated successfully!');
    } catch (error) {
        console.error('API Error:', error);
        showToast('Error generating code: ' + error.message, 'error');
        codeOutput.textContent = 'Error generating code. Please try again.';
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Code';
    }
}

// Parse generated code to extract files
function parseGeneratedCode(code) {
    const files = {};
    // Enhanced parsing to handle language-specific code blocks
    const fileMatches = code.match(/```[\w-]+\n[\s\S]+?```/g) || [];
    
    fileMatches.forEach(match => {
        const langMatch = match.match(/```([\w-]+)/);
        if (!langMatch) return;
        
        const fileName = getFileNameFromLang(langMatch[1]);
        const content = match.replace(/```[\w-]+\n/, '').replace(/```$/, '').trim();
        
        if (fileName && content) {
            files[fileName] = content;
        }
    });
    
    return files;
}

// Helper function to determine filename from language
function getFileNameFromLang(lang) {
    const langMap = {
        'javascript': 'script.js',
        'js': 'script.js',
        'html': 'index.html',
        'css': 'styles.css',
        'python': 'script.py',
        'java': 'Main.java',
        'cpp': 'main.cpp',
        'c': 'main.c',
        'php': 'index.php',
        'ruby': 'script.rb',
        'go': 'main.go',
        'rust': 'main.rs',
        'typescript': 'script.ts',
        'ts': 'script.ts',
        'jsx': 'component.jsx',
        'tsx': 'component.tsx',
        'json': 'config.json',
        'yaml': 'config.yaml',
        'yml': 'config.yml',
        'markdown': 'README.md',
        'md': 'README.md'
    };
    
    return langMap[lang.toLowerCase()] || `file.${lang}`;
}

// Generate ZIP file
downloadZip.addEventListener('click', async () => {
    try {
        const zip = new JSZip();
        
        // Add all generated files to the ZIP
        for (const [fileName, content] of generatedFiles) {
            zip.file(fileName, content);
        }
        
        // Generate and download the ZIP file
        const blob = await zip.generateAsync({type: 'blob'});
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-code.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('Files downloaded successfully!');
    } catch (error) {
        showToast('Error creating ZIP file: ' + error.message, 'error');
    }
});

// Handle generate button click
generateBtn.addEventListener('click', () => {
    const prompt = userPrompt.value.trim();
    if (!prompt) {
        showToast('Please enter a prompt', 'error');
        return;
    }
    generateCode(prompt);
}); 
