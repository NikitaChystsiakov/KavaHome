import { getImageProps } from "next/image";

// Заранее подгружает фото, которые вот-вот понадобятся (соседняя коллекция, другие цвета карточки).
// Берёт тот же srcset и sizes, что отдаст <Image>, поэтому браузер выберет тот же файл и потом возьмёт его из кэша.
const warmed = new Set<string>();

export function warm(srcs: (string | undefined)[], sizes: string, quality = 75) {
  if (typeof window === "undefined") return;
  for (const src of srcs) {
    if (!src) continue;
    const key = `${src}|${sizes}|${quality}`;
    if (warmed.has(key)) continue;
    warmed.add(key);
    const { props } = getImageProps({ src, alt: "", fill: true, sizes, quality });
    const img = new window.Image();
    img.decoding = "async";
    img.fetchPriority = "low";
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
  }
}
