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
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI coding assistant. Generate code based on the user\'s request. Include all necessary files and dependencies.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const generatedCode = data.choices[0].message.content;
        
        // Parse the response and extract files
        const files = parseGeneratedCode(generatedCode);
        generatedFiles = new Map(Object.entries(files));
        
        // Display the main code
        codeOutput.textContent = generatedCode;
        
        // Enable download button
        downloadZip.disabled = false;
    } catch (error) {
        showToast('Error generating code: ' + error.message, 'error');
    }
}

// Parse generated code to extract files
function parseGeneratedCode(code) {
    const files = {};
    // Basic parsing - you might want to enhance this based on the AI's output format
    const fileMatches = code.match(/```[\w-]+\n[\s\S]+?```/g) || [];
    
    fileMatches.forEach(match => {
        const fileName = match.match(/```([\w-]+)/)[1];
        const content = match.replace(/```[\w-]+\n/, '').replace(/```$/, '');
        files[fileName] = content;
    });
    
    return files;
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