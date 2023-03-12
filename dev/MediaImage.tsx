import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { MediaItem } from 'mui-edit/controls/MediaLibraryControl';
import React, { ImgHTMLAttributes } from 'react';
import { useStorage } from './Storage';

const deviceSizes = [375, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const imgSizes = [16, 32, 64, 128, 144, 192, 256, 320];

const MediaImage: React.FC<({
  data: MediaItem,
  width?: number,
  height?: number,
  fill: true,
} | {
  data: MediaItem,
  width: number,
  height: number,
  fill?: false,
}) & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'>> = (props) => {
  const {
    data,
    width,
    height,
    fill,
    className: propClassname,
    ...imgProps
  } = props;
  const storage = useStorage();
  const urlsQuery = useQuery({
    queryKey: ['MediaImage', data.key, width, fill],
    async queryFn() {
      const allSizes = [...imgSizes, ...deviceSizes].filter((size, i, array) => {
        if (fill) {
          return deviceSizes.includes(size);
        }
        if (size <= width) {
          return true;
        }
        const prevSize = i === 0 ? 0 : array[i - 1];
        return prevSize < width;
      });
      const thumbnailsPromises = allSizes.map(async (size) => {
        const url = await storage.imagePreviewUrl({ key: data.key, width: size });
        return [size, url] as [number, string];
      });
      const [original, thumbnails] = await Promise.all([
        storage.objectUrl({ key: data.key }),
        Promise.all(thumbnailsPromises),
      ]);
      return {
        original,
        thumbnails: thumbnails.sort((a, b) => a[0] > b[0] ? 1 : -1),
      };
    },
  });
  const className = clsx(
    propClassname,
    fill ? 'w-full h-full absolute' : '',
  );
  if (!urlsQuery.data) {
    if (urlsQuery.isLoading) {
      return (
        <span className={className} {...imgProps}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </span>
      )
    }
    if (urlsQuery.isError) {
      <span className={className} {...imgProps}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </span>
    }
    return null;
  }
  const urls = urlsQuery.data;
  return (
    <img
      className={className}
      src={urls.original}
      srcSet={urls.thumbnails.map(([size, url]) => {
        return `${url} ${size}w`;
      }).join(', ')}
      sizes={urls.thumbnails.map(([size], i) => {
        return `(max-width: ${size}px) ${size}px`;
      }).join(', ')}
      width={width}
      height={height}
      {...imgProps}
    />
  );
};

export default MediaImage;
