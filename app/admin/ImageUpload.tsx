'use client';

import { useState } from 'react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/content', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      console.log('Upload response:', data);

      if (res.ok && data.url) {
        onUpload(data.url);
      } else {
        console.error('Failed to upload image', data.error);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className="inline-block w-full cursor-pointer rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-main hover:bg-primary/80 focus:outline-none transition duration-300"
      >
        {file ? file.name : 'Choose an image'}
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="mt-4 text-right">
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`px-4 py-2 text-sm font-medium rounded-md transition duration-300 ${
            uploading || !file
              ? 'bg-primary/80 text-main cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 text-main'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
}