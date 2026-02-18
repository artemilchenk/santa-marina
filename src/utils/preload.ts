import { ErrorException } from '~/exceptions/error-exception';

export const preload = async (src: string, blobType?: 'video' | 'image', signal?: AbortController['signal']): Promise<string> => {
  try {
    const response = await fetch(src, { signal });
    if (!response.ok) {
      throw new Error(`Failed to load file: ${src}`);
    }
    const blob = await response.blob();

    if (blobType && blobType === 'video') {
      if (!blob.type.includes('video')) throw new ErrorException('Video not found');
    } else if (blob.type === 'text/html') {
      throw new Error(`Failed to load file: blob type is text/html\n ${src}`);
    }

    const url = URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.error('Error in preload:', error);
    throw error;
  }
};
