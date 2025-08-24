import React, { useState } from 'react';
import { Upload, RotateCw, FlipHorizontal, Crop, Download, Sparkles, Wand2, Palette } from 'lucide-react';
import { useImageEditor } from '../hooks/useImageEditor';
import { simulateAIUpscale, simulateAIAutoEnhance } from '../utils/imageUtils';
import { ImageAdjustments, BrushSettings, TextSettings } from '../types';

interface ImageEditorProps {
  isPremium: boolean;
  isDarkMode: boolean;
  onSaveEdit?: (imageName: string, operations: string[]) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ isPremium, isDarkMode, onSaveEdit }) => {
  const { 
    canvasRef, 
    editorState, 
    setEditorState, 
    isCropping, 
    cropRect, 
    loadImage, 
    resetImage, 
    startCrop, 
    applyCrop, 
    cancelCrop, 
    applyFilter, 
    rotateImage, 
    flipImage, 
    downloadImage 
  } = useImageEditor();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0
  });
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    color: '#ff0000',
    size: 5,
    opacity: 1
  });
  const [editOperations, setEditOperations] = useState<string[]>([]);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  };

  const addOperation = (operation: string) => {
    setEditOperations(prev => [...prev, operation]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleAIUpscale = async () => {
    if (!isPremium) {
      alert('AI Upscale is a premium feature!');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    setProcessingText('AI Upscaling in progress... (2x resolution + sharpening)');
    
    try {
      await simulateAIUpscale(canvas);
      alert('AI Upscale completed! Your image resolution has been doubled and enhanced with AI sharpening.');
      addOperation('AI Upscale');
    } catch (error) {
      alert('Error during AI upscaling');
    } finally {
      setIsProcessing(false);
      setProcessingText('');
    }
  };

  const handleAIAutoEnhance = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    setProcessingText('AI Auto-Enhancement in progress... (brightness + contrast + saturation)');
    
    try {
      await simulateAIAutoEnhance(canvas);
      alert('AI Auto-Enhancement completed! Your image has been enhanced with improved brightness, contrast, and saturation.');
      addOperation('AI Auto-Enhance');
    } catch (error) {
      alert('Error during AI enhancement');
    } finally {
      setIsProcessing(false);
      setProcessingText('');
    }
  };

  const applyAdjustments = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness
      data[i] = Math.min(255, Math.max(0, data[i] + adjustments.brightness));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + adjustments.brightness));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + adjustments.brightness));
      
      // Apply contrast
      const contrastFactor = (259 * (adjustments.contrast + 255)) / (255 * (259 - adjustments.contrast));
      data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128));
      
      // Apply saturation
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const saturationFactor = 1 + (adjustments.saturation / 100);
      
      data[i] = Math.min(255, Math.max(0, gray + saturationFactor * (r - gray)));
      data[i + 1] = Math.min(255, Math.max(0, gray + saturationFactor * (g - gray)));
      data[i + 2] = Math.min(255, Math.max(0, gray + saturationFactor * (b - gray)));
      
      // Apply exposure (similar to brightness but multiplicative)
      const exposureFactor = Math.pow(2, adjustments.exposure / 100);
      data[i] = Math.min(255, data[i] * exposureFactor);
      data[i + 1] = Math.min(255, data[i + 1] * exposureFactor);
      data[i + 2] = Math.min(255, data[i + 2] * exposureFactor);
    }
    
    ctx.putImageData(imageData, 0, 0);
    addOperation('Manual Adjustments');
  };

  const applyMoreFilters = (filterType: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (filterType) {
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
      case 'vintage':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] + 30);
          data[i + 1] = Math.min(255, data[i + 1] + 20);
          data[i + 2] = Math.max(0, data[i + 2] - 10);
        }
        break;
      case 'cool':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, data[i] - 10);
          data[i + 1] = Math.min(255, data[i + 1] + 10);
          data[i + 2] = Math.min(255, data[i + 2] + 20);
        }
        break;
      case 'warm':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] + 20);
          data[i + 1] = Math.min(255, data[i + 1] + 10);
          data[i + 2] = Math.max(0, data[i + 2] - 10);
        }
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
    addOperation(`${filterType} filter`);
  };

  const handleBrushTool = () => {
    if (!isPremium) {
      alert('Brush Tool is a premium feature! Enable premium mode to use this tool.');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    alert('Brush Tool activated! Click and drag on the image to draw. (This is a demo - full brush functionality would be implemented here)');
    
    // Simple brush demo
    let isDrawing = false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    
    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      ctx.lineWidth = brushSettings.size;
      ctx.lineCap = 'round';
      ctx.strokeStyle = brushSettings.color;
      ctx.globalAlpha = brushSettings.opacity;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    
    const stopDrawing = () => {
      isDrawing = false;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      // Remove event listeners after 10 seconds
      setTimeout(() => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        alert('Brush tool deactivated.');
        addOperation('Brush Tool');
      }, 10000);
    };
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
  };
  
  const handleTextTool = () => {
    if (!isPremium) {
      alert('Text Tool is a premium feature! Enable premium mode to use this tool.');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const text = prompt('Enter text to add to your image:');
    if (!text) return;
    
    const fontSize = prompt('Enter font size (default: 48):') || '48';
    const color = prompt('Enter text color (default: red):') || '#ff0000';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Add text to center of image
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    alert('Text added to your image!');
    addOperation('Text Tool');
  };

  const handleResize = (percentage: number) => {
    if (!editorState.originalImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const scale = percentage / 100;
    const newWidth = Math.floor(editorState.originalImage.width * scale);
    const newHeight = Math.floor(editorState.originalImage.height * scale);
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw resized image
    ctx.drawImage(editorState.originalImage, 0, 0, newWidth, newHeight);
    
    alert(`Image resized to ${percentage}% of original size (${newWidth}x${newHeight}px)`);
    addOperation(`Resize to ${percentage}%`);
  };

  const removeImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset state
    setEditorState({
      originalImage: null,
      isCropping: false,
      cropRect: { x: 0, y: 0, width: 0, height: 0 }
    });
    setEditOperations([]);
  };

  return (
    <div className={`rounded-xl p-8 shadow-lg transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <h2 className={`text-2xl font-bold mb-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        AI-Powered Image Editor
      </h2>
      <p className={`mb-6 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Upload a single image and use our advanced tools to edit, enhance, and optimize it.
      </p>
      
      {!editorState.originalImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-green-500 transition-colors duration-200 ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700' 
              : 'border-gray-300 bg-white'
          }`}
          onClick={() => document.getElementById('singleFileInput')?.click()}
        >
          <Upload className={`w-16 h-16 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <p className={`text-lg mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Drag and drop a single image here or click to upload
          </p>
          <small className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Supports JPEG, PNG, WebP formats
          </small>
          <input
            id="singleFileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {isProcessing && (
            <div className={`border rounded-lg p-4 text-center ${
              isDarkMode 
                ? 'bg-blue-900 border-blue-700' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className={`font-medium ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>{processingText}</span>
              </div>
            </div>
          )}
          
          {isCropping && (
            <div className={`border rounded-lg p-4 text-center ${
              isDarkMode 
                ? 'bg-orange-900 border-orange-700' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <p className={`font-medium mb-3 ${
                isDarkMode ? 'text-orange-400' : 'text-orange-600'
              }`}>
                Crop Mode Active - Click and drag on the image to select crop area
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={applyCrop}
                  disabled={cropRect.width === 0 || cropRect.height === 0}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  Apply Crop
                </button>
                <button
                  onClick={cancelCrop}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel Crop
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => { applyFilter('grayscale'); addOperation('Grayscale'); }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Grayscale
            </button>
            <button
              onClick={() => { applyFilter('brighten'); addOperation('Brighten'); }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Brighten
            </button>
            <button
              onClick={() => { applyFilter('darken'); addOperation('Darken'); }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Darken
            </button>
            <button
              onClick={() => { applyFilter('contrast-more'); addOperation('More Contrast'); }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              More Contrast
            </button>
            <button
              onClick={() => { applyFilter('contrast-less'); addOperation('Less Contrast'); }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Less Contrast
            </button>
            <button
              onClick={() => { rotateImage(90); addOperation('Rotate Right'); }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <RotateCw size={16} />
              <span>Rotate Right</span>
            </button>
            <button
              onClick={() => { flipImage(); addOperation('Flip Horizontal'); }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FlipHorizontal size={16} />
              <span>Flip Horizontal</span>
            </button>
            <button
              onClick={() => { startCrop(); addOperation('Crop'); }}
              disabled={isProcessing || isCropping}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Crop size={16} />
              <span>Crop</span>
            </button>
            
            {/* More Filters */}
            <button
              onClick={() => applyMoreFilters('sepia')}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sepia
            </button>
            <button
              onClick={() => applyMoreFilters('vintage')}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vintage
            </button>
            <button
              onClick={() => applyMoreFilters('cool')}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cool Tone
            </button>
            <button
              onClick={() => applyMoreFilters('warm')}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Warm Tone
            </button>
            
            {/* Adjustments Toggle */}
            <button
              onClick={() => setShowAdjustments(!showAdjustments)}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 ${
                showAdjustments
                  ? 'bg-green-600 text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Palette size={16} />
              <span>Adjustments</span>
            </button>
            
            <button
              onClick={handleAIAutoEnhance}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Sparkles size={16} />
              <span>AI Auto-Enhance</span>
            </button>
            <button
              onClick={handleAIUpscale}
              disabled={!isPremium || isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                isPremium 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              title={!isPremium ? 'Premium feature - Toggle premium mode to unlock' : 'AI Upscale (2x resolution)'}
            >
              <Wand2 size={16} />
              <span>AI Upscale</span>
            </button>
            <button
              onClick={handleBrushTool}
              disabled={!isPremium || isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isPremium 
                  ? (isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                  : (isDarkMode 
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed')
              }`}
              title={!isPremium ? 'Premium feature' : 'Brush Tool'}
            >
              Brush
            </button>
            <button
              onClick={handleTextTool}
              disabled={!isPremium || isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isPremium 
                  ? (isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                  : (isDarkMode 
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed')
              }`}
              title={!isPremium ? 'Premium feature' : 'Text Tool'}
            >
              Text
            </button>
            <select
              onChange={(e) => handleResize(parseInt(e.target.value))}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              defaultValue="100"
            >
              <option value="100">Original Size</option>
              <option value="90">90% Size</option>
              <option value="80">80% Size</option>
              <option value="70">70% Size</option>
              <option value="60">60% Size</option>
              <option value="50">50% Size</option>
              <option value="40">40% Size</option>
              <option value="30">30% Size</option>
              <option value="20">20% Size</option>
            </select>
            <button
              onClick={resetImage}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={removeImage}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <span>Remove Photo</span>
            </button>
            <button
              onClick={() => { downloadImage(); onSaveEdit?.('edited_image.png', editOperations); }}
              disabled={isProcessing}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
          
          {/* Advanced Adjustments Panel */}
          {showAdjustments && (
            <div className={`rounded-lg p-6 mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Fine-Tune Adjustments
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Brightness: {adjustments.brightness}
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.brightness}
                    onChange={(e) => setAdjustments(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Contrast: {adjustments.contrast}
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.contrast}
                    onChange={(e) => setAdjustments(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Saturation: {adjustments.saturation}
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.saturation}
                    onChange={(e) => setAdjustments(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Exposure: {adjustments.exposure}
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.exposure}
                    onChange={(e) => setAdjustments(prev => ({ ...prev, exposure: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={applyAdjustments}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Apply Adjustments
                </button>
                <button
                  onClick={() => setAdjustments({ brightness: 0, contrast: 0, saturation: 0, exposure: 0 })}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
          
          {/* Brush Settings (Premium) */}
          {isPremium && (
            <div className={`rounded-lg p-4 mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h4 className={`font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Brush Settings
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Color</label>
                  <input
                    type="color"
                    value={brushSettings.color}
                    onChange={(e) => setBrushSettings(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-8 rounded"
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Size: {brushSettings.size}</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSettings.size}
                    onChange={(e) => setBrushSettings(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Opacity: {Math.round(brushSettings.opacity * 100)}%</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={brushSettings.opacity}
                    onChange={(e) => setBrushSettings(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className={`rounded-lg p-4 overflow-auto max-h-96 ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}>
            <canvas
              ref={canvasRef}
              className={`max-w-full h-auto border-2 rounded-lg mx-auto bg-white ${
                isDarkMode ? 'border-gray-600' : 'border-gray-300'
              }`}
              style={{ display: editorState.originalImage ? 'block' : 'none' }}
            />
            {!editorState.originalImage && (
              <div className={`text-center py-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Upload an image to start editing
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};