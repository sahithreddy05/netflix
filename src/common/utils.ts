export function createImageURL(path: string, width: number) {
  return `${import.meta.env.VITE_BASE_IMAGE_URL}/w${width}/${path}`;
}
