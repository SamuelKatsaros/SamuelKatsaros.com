import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.PUBLIC_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET
});

export const getCloudinaryUrl = (url: string) => {
  if (!url) return '';
  
  // If it's already a Cloudinary URL, return as is
  if (url.includes('res.cloudinary.com')) return url;
  
  // For external URLs (like Unsplash), use Cloudinary's fetch feature
  if (url.startsWith('http')) {
    return cloudinary.url(url, {
      type: 'fetch',
      quality: 'auto',
      fetch_format: 'auto'
    });
  }
  
  // For local images, use direct upload
  return cloudinary.url(url, {
    quality: 'auto',
    fetch_format: 'auto'
  });
};