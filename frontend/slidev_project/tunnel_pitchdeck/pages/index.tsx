import React from 'react';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function Home() {
  const [fileData, setFileData] = useState<File | null>(null);
  const [result, setResult] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileData(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileData) return;

    const formData = new FormData();
    formData.append('scriptData', fileData);

    // Send a POST request to our API route.
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data.slides || 'No slides generated');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Pitch Deck Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Upload your screenplay JSON:
          <input type="file" accept=".json" onChange={handleFileChange} />
        </label>
        <button type="submit">Generate Slides</button>
      </form>
      {result && (
        <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
          <h2>Generated Slides:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}