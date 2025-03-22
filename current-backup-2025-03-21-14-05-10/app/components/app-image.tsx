import Image, { ImageProps } from 'next/image';
import { getImagePath } from '../utils/image-path';

type AppImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

/**
 * AppImage component that handles image paths for both development and production environments.
 * Wraps the Next.js Image component with proper path handling.
 */
export default function AppImage({ src, alt, ...props }: AppImageProps) {
  // Process the src to ensure it has the correct path for the current environment
  const processedSrc = getImagePath(src);

  return (
    <Image
      src={processedSrc}
      alt={alt || 'Image'}
      {...props}
    />
  );
} 