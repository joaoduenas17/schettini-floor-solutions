/* eslint-disable @next/next/no-img-element */
import { photoSrcSet, type ProjectPhoto } from "./projects";

export function ProjectPicture({ photo, className, sizes = "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 590px", eager = false, onLoad, onError }: {
  photo: ProjectPhoto;
  className?: string;
  sizes?: string;
  eager?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={photoSrcSet(photo, "avif")} sizes={sizes} />
      <img src={photo.src} srcSet={photoSrcSet(photo, "webp")} sizes={sizes} alt={photo.alt} width={photo.width} height={photo.height} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" onLoad={onLoad} onError={onError} />
    </picture>
  );
}
