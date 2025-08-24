export const processImageWithQuality = (image: HTMLImageElement, quality: number): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    
    canvas.toBlob(
      (blob) => {
        resolve(blob!);
      },
      'image/jpeg',
      quality
    );
  });
};

export const createPreviewImage = (image: HTMLImageElement, maxWidth: number = 150): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const scale = maxWidth / image.width;
  canvas.width = maxWidth;
  canvas.height = image.height * scale;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL();
};

export const simulateAIUpscale = async (canvas: HTMLCanvasElement): Promise<void> => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve();

    // Get current image data
    const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Double the resolution for AI upscaling
    const newWidth = Math.min(canvas.width * 2, 2000); // Cap at 2000px
    const newHeight = Math.min(canvas.height * 2, 2000);
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return resolve();

    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    
    // Use high-quality scaling
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
    
    // Apply sharpening filter to simulate AI enhancement
    const imageData = tempCtx.getImageData(0, 0, newWidth, newHeight);
    const data = imageData.data;
    
    // Simple sharpening kernel
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast slightly for sharpening effect
      const factor = 1.2;
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }
    
    tempCtx.putImageData(imageData, 0, 0);
    
    // Update the original canvas
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(tempCanvas, 0, 0);
    
    // Simulate processing time
    setTimeout(() => resolve(), 3000);
  });
};

export const simulateAIAutoEnhance = async (canvas: HTMLCanvasElement): Promise<void> => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply more noticeable auto-enhancement
    for (let i = 0; i < data.length; i += 4) {
      // More noticeable brightness boost
      data[i] = Math.min(255, data[i] + 25);
      data[i + 1] = Math.min(255, data[i + 1] + 25);
      data[i + 2] = Math.min(255, data[i + 2] + 25);
      
      // More noticeable contrast boost
      const contrast = 1.3;
      data[i] = Math.min(255, Math.max(0, contrast * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, contrast * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, contrast * (data[i + 2] - 128) + 128));
      
      // Saturation boost
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const saturation = 1.4;
      
      data[i] = Math.min(255, Math.max(0, gray + saturation * (r - gray)));
      data[i + 1] = Math.min(255, Math.max(0, gray + saturation * (g - gray)));
      data[i + 2] = Math.min(255, Math.max(0, gray + saturation * (b - gray)));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Simulate processing time
    setTimeout(() => resolve(), 2000);
  });
};