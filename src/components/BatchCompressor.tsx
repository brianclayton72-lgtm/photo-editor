import React, { useState, useCallback } from 'react';
import { Upload, Download, X } from 'lucide-react';
import { ImageFile } from '../types';
import { processImageWithQuality, createPreviewImage } from '../utils/imageUtils';

interface BatchCompressorProps {
  isDarkMode: boolean;
}

export const BatchCompressor: React.FC<BatchCompressorProps> = ({ isDarkMode }) => {
  const [files, setFiles] = useState<ImageFile[]>([]);

  const handleFilesUpload = useCallback(async (selectedFiles: FileList) => {
    const validTypes = ['image/jpeg'];
    const newFiles = Array.from(selectedFiles).filter(f => validTypes.includes(f.type));
    
    if (files.length + newFiles.length > 20) {
      alert("Upload limit of 20 images reached.");
      return;
    }

    const processedFiles: ImageFile[] = [];
    
    for (const file of newFiles) {
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      await new Promise<void>((resolve) => {
        img.onload = async () => {
          const blob = await processImageWithQuality(img, 0.7);
          const imageFile: ImageFile = {
            file,
            blob,
            name: file.name.replace(/\.[^/.]+$/, '.jpg'),
            quality: 0.7,
            originalSize: file.size,
            compressedSize: blob.size
          };
          processedFiles.push(imageFile);
          URL.revokeObjectURL(imageUrl);
          resolve();
        };
        img.src = imageUrl;
      });
    }
    
    setFiles(prev => [...prev, ...processedFiles]);
  }, [files.length]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const updateQuality = async (index: number, newQuality: number) => {
    const file = files[index];
    const img = new Image();
    const imageUrl = URL.createObjectURL(file.file);
    
    img.onload = async () => {
      const blob = await processImageWithQuality(img, newQuality);
      setFiles(prev => prev.map((f, i) => 
        i === index 
          ? { ...f, quality: newQuality, blob, compressedSize: blob.size }
          : f
      ));
      URL.revokeObjectURL(imageUrl);
    };
    img.src = imageUrl;
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const downloadZip = async () => {
    if (files.length === 0) {
      alert("No images to download.");
      return;
    }

    // Dynamic import for JSZip
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    files.forEach(f => {
      if (f.blob) {
        zip.file(f.name, f.blob);
      }
    });
    
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "compressed_images.zip";
    link.click();
  };

  return (
    <div className={`rounded-xl p-8 shadow-lg transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <h2 className={`text-2xl font-bold mb-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Batch Image Compressor
      </h2>
      <p className={`mb-6 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Upload up to 20 JPEG images and optimize them with adjustable quality settings.
      </p>
      
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-green-500 transition-colors duration-200 mb-6 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-700' 
            : 'border-gray-300 bg-white'
        }`}
        onClick={() => document.getElementById('batchFileInput')?.click()}
      >
        <Upload className={`w-16 h-16 mx-auto mb-4 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-400'
        }`} />
        <p className={`text-lg mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Drag and drop JPEG images here or click to upload
        </p>
        <small className={`${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Upload up to 20 JPEG images. Maximum file size: 10MB each.
        </small>
        <input
          id="batchFileInput"
          type="file"
          multiple
          accept="image/jpeg"
          className="hidden"
          onChange={(e) => e.target.files && handleFilesUpload(e.target.files)}
        />
      </div>
      
      {files.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {files.map((file, index) => (
              <ImagePreview
                key={index}
                file={file}
                onQualityChange={(quality) => updateQuality(index, quality)}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <p className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Uploaded: {files.length} of 20
            </p>
            <button
              onClick={downloadZip}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Download ZIP</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

interface ImagePreviewProps {
  file: ImageFile;
  onQualityChange: (quality: number) => void;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onQualityChange, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  React.useEffect(() => {
    const img = new Image();
    const url = URL.createObjectURL(file.file);
    img.onload = () => {
      setPreviewUrl(createPreviewImage(img));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [file.file]);

  const qualityOptions = [90, 80, 70, 60, 40, 20];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-32 object-contain rounded-lg"
        />
      )}
      
      <div className="space-y-2">
        <select
          value={file.quality}
          onChange={(e) => onQualityChange(parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
        >
          {qualityOptions.map(q => (
            <option key={q} value={q / 100}>
              {q}% Quality
            </option>
          ))}
        </select>
        
        <p className="text-xs text-gray-500">
          Original: {(file.originalSize / 1024).toFixed(1)}KB
          <br />
          Compressed: {(file.compressedSize / 1024).toFixed(1)}KB
        </p>
        
        <button
          onClick={onRemove}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <X size={14} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};