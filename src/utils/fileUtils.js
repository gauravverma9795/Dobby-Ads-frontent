// src/utils/fileUtils.js
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  export const isImageFile = (filename) => {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extension = filename.split('.').pop().toLowerCase();
    return validExtensions.includes(extension);
  };
  
  export const generateThumbnail = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };