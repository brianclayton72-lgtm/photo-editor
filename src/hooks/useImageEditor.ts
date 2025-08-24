import { useState, useRef, useCallback } from 'react';
import { ImageEditorState, CropRect } from '../types';

export const useImageEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropRect, setCropRect] = useState<CropRect>({ x: 0, y: 0, width: 0, height: 0 });
  const [editorState, setEditorState] = useState<ImageEditorState>({
    originalImage: null,
    isCropping: false,
    cropRect: { x: 0, y: 0, width: 0, height: 0 }
  });

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setEditorState(prev => ({ ...prev, originalImage: img }));
        // Render image immediately when loaded
        setTimeout(() => renderImage(img), 100);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const renderImage = useCallback((image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate display size while maintaining aspect ratio
    const maxWidth = 800;
    const maxHeight = 600;
    let { width, height } = image;
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image on top of white background
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, []);

  const startCrop = useCallback(() => {
    setIsCropping(true);
    setEditorState(prev => ({ ...prev, isCropping: true }));
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let isDrawing = false;
    
    const handleMouseDown = (e: MouseEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      setCropStart({ x, y });
      setCropRect({ x, y, width: 0, height: 0 });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!cropStart || !isDrawing) return;
      
      const rect = canvas.getBoundingClientRect();
      const currentX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const currentY = (e.clientY - rect.top) * (canvas.height / rect.height);
      
      const newCropRect = {
        x: Math.min(cropStart.x, currentX),
        y: Math.min(cropStart.y, currentY),
        width: Math.abs(currentX - cropStart.x),
        height: Math.abs(currentY - cropStart.y)
      };
      
      setCropRect(newCropRect);
      
      // Redraw image with crop overlay
      if (editorState.originalImage) {
        renderImage(editorState.originalImage);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw crop overlay
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(newCropRect.x, newCropRect.y, newCropRect.width, newCropRect.height);
          ctx.setLineDash([]);
          
          // Draw semi-transparent overlay outside crop area
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.clearRect(newCropRect.x, newCropRect.y, newCropRect.width, newCropRect.height);
          
          // Redraw the image in the crop area
          ctx.drawImage(editorState.originalImage, 0, 0, canvas.width, canvas.height);
          
          // Draw the crop rectangle again on top
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(newCropRect.x, newCropRect.y, newCropRect.width, newCropRect.height);
          ctx.setLineDash([]);
        }
      }
    };
    
    const handleMouseUp = () => {
      isDrawing = false;
      setCropStart(null);
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    canvas.style.cursor = 'crosshair';
    
    // Store cleanup function
    const cleanup = () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.style.cursor = 'default';
    };
    
    // Store cleanup function for later use
    (canvas as any)._cropCleanup = cleanup;
  }, [editorState.originalImage, cropStart, renderImage]);
  
  const applyCrop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !editorState.originalImage || cropRect.width === 0 || cropRect.height === 0) return;
    
    // Clean up event listeners
    if ((canvas as any)._cropCleanup) {
      (canvas as any)._cropCleanup();
      delete (canvas as any)._cropCleanup;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create a new canvas with cropped dimensions
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return;
    
    croppedCanvas.width = cropRect.width;
    croppedCanvas.height = cropRect.height;
    
    // Fill with white background
    croppedCtx.fillStyle = '#ffffff';
    croppedCtx.fillRect(0, 0, croppedCanvas.width, croppedCanvas.height);
    
    // Draw the cropped portion
    croppedCtx.drawImage(
      canvas,
      cropRect.x, cropRect.y, cropRect.width, cropRect.height,
      0, 0, cropRect.width, cropRect.height
    );
    
    // Update the main canvas
    canvas.width = cropRect.width;
    canvas.height = cropRect.height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(croppedCanvas, 0, 0);
    
    // Reset crop state
    setIsCropping(false);
    setEditorState(prev => ({ ...prev, isCropping: false, cropRect: { x: 0, y: 0, width: 0, height: 0 } }));
    setCropRect({ x: 0, y: 0, width: 0, height: 0 });
    canvas.style.cursor = 'default';
    
    alert('Image cropped successfully!');
  }, [cropRect, editorState.originalImage]);
  
  const cancelCrop = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && (canvas as any)._cropCleanup) {
      (canvas as any)._cropCleanup();
      delete (canvas as any)._cropCleanup;
    }
    
    setIsCropping(false);
    setEditorState(prev => ({ ...prev, isCropping: false, cropRect: { x: 0, y: 0, width: 0, height: 0 } }));
    setCropRect({ x: 0, y: 0, width: 0, height: 0 });
    setCropStart(null);
    
    if (canvas) {
      canvas.style.cursor = 'default';
      if (editorState.originalImage) {
        renderImage(editorState.originalImage);
      }
    }
  }, [editorState.originalImage, renderImage]);
  const resetImage = useCallback(() => {
    if (!editorState.originalImage) return;
    renderImage(editorState.originalImage);
    setEditorState(prev => ({
      ...prev,
      isCropping: false,
      cropRect: { x: 0, y: 0, width: 0, height: 0 }
    }));
    setIsCropping(false);
    setCropRect({ x: 0, y: 0, width: 0, height: 0 });
    setCropStart(null);
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'default';
    }
  }, [editorState.originalImage, renderImage]);

  const applyFilter = useCallback((filterType: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (filterType) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        break;
      case 'brighten':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] + 20);
          data[i + 1] = Math.min(255, data[i + 1] + 20);
          data[i + 2] = Math.min(255, data[i + 2] + 20);
        }
        break;
      case 'darken':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, data[i] - 20);
          data[i + 1] = Math.max(0, data[i + 1] - 20);
          data[i + 2] = Math.max(0, data[i + 2] - 20);
        }
        break;
      case 'contrast-more':
        const factor1 = (259 * (20 + 255)) / (255 * (259 - 20));
        for (let i = 0; i < data.length; i += 4) {
          data[i] = factor1 * (data[i] - 128) + 128;
          data[i + 1] = factor1 * (data[i + 1] - 128) + 128;
          data[i + 2] = factor1 * (data[i + 2] - 128) + 128;
        }
        break;
      case 'contrast-less':
        const factor2 = (259 * (-20 + 255)) / (255 * (259 + 20));
        for (let i = 0; i < data.length; i += 4) {
          data[i] = factor2 * (data[i] - 128) + 128;
          data[i + 1] = factor2 * (data[i + 1] - 128) + 128;
          data[i + 2] = factor2 * (data[i + 2] - 128) + 128;
        }
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const rotateImage = useCallback((degrees: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newCanvas = document.createElement('canvas');
    const newCtx = newCanvas.getContext('2d');
    if (!newCtx) return;

    const rad = degrees * Math.PI / 180;
    const newWidth = Math.abs(Math.cos(rad) * canvas.width) + Math.abs(Math.sin(rad) * canvas.height);
    const newHeight = Math.abs(Math.sin(rad) * canvas.width) + Math.abs(Math.cos(rad) * canvas.height);
    
    newCanvas.width = newWidth;
    newCanvas.height = newHeight;
    newCtx.translate(newWidth / 2, newHeight / 2);
    newCtx.rotate(rad);
    newCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(newCanvas, 0, 0);
    }
  }, []);

  const flipImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, []);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return {
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
  };
};