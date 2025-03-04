import React from 'react';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

export default function Home() {
  const [fileData, setFileData] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [useDefault, setUseDefault] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileData(e.target.files[0]);
      setUseDefault(false);
    }
  };

  const toggleUseDefault = () => {
    setUseDefault(!useDefault);
    if (!useDefault) {
      setFileData(null);
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    if (useDefault) {
      // Use the default file
      formData.append('useDefault', 'true');
    } else if (fileData) {
      // Use the uploaded file
      formData.append('scriptData', fileData);
    } else {
      alert('Please select a file or use the default example');
      return;
    }

    // Send a POST request to our API route
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      
      const data = await res.json();
      setResult(data.slides || 'No slides generated');
    } catch (error) {
      console.error('Error generating slides:', error);
      setResult('Error generating slides. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Pitch Deck Generator</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Upload your screenplay JSON:
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileChange} 
              disabled={useDefault}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
          
          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                checked={useDefault} 
                onChange={toggleUseDefault}
                style={{ marginRight: '0.5rem' }}
              />
              Use default example (bad-ass-girls.json)
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Generate Slides
        </button>
      </form>
      
      {result && (
        <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
          <h2>Generated Slides:</h2>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}