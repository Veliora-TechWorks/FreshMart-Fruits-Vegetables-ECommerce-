'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (imageData: { url: string; publicId: string }) => void;
  maxFiles?: number;
}

export default function ImageUpload({ onUpload, maxFiles = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; publicId: string }>>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);

    for (let i = 0; i < Math.min(files.length, maxFiles - uploadedImages.length); i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const imageData = await response.json();
          setUploadedImages(prev => [...prev, imageData]);
          onUpload(imageData);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setUploading(false);
  };

  const removeImage = (publicId: string) => {
    setUploadedImages(prev => prev.filter(img => img.publicId !== publicId));
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
          disabled={uploading || uploadedImages.length >= maxFiles}
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload images'}
          </span>
          <span className="text-xs text-gray-400">
            {uploadedImages.length}/{maxFiles} images uploaded
          </span>
        </label>
      </div>

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={image.publicId} className="relative group">
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(image.publicId)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}