import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PhotoDropzoneProps {
  onFilesUploaded: (files: File[]) => void;
  isProcessing?: boolean;
}

export const PhotoDropzone: React.FC<PhotoDropzoneProps> = ({ 
  onFilesUploaded, 
  isProcessing 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    setUploadedFiles(prev => [...prev, ...imageFiles]);
    onFilesUploaded(imageFiles);
  }, [onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
    disabled: isProcessing
  });

  return (
    <div className="space-y-4">
      <Card 
        {...getRootProps()} 
        className={`
          p-12 text-center cursor-pointer transition-all duration-300
          border-2 border-dashed
          ${isDragActive 
            ? 'border-primary bg-primary/5 shadow-lg transform scale-105' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/2'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-church-gold flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {isDragActive ? 'Drop your church photos here' : 'Upload Church Photos'}
            </h3>
            <p className="text-muted-foreground">
              Drag and drop multiple images, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPEG, PNG, WebP, and GIF formats
            </p>
          </div>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h4 className="font-medium">
              {uploadedFiles.length} photo{uploadedFiles.length !== 1 ? 's' : ''} uploaded
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index} 
                className="aspect-square bg-muted rounded-lg overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};