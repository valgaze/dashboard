# ImageRetry

Presentational image component. Tries to load an image source a number of times, then falls back to an alternate rendering mode.

## Component Props

- `src: string` - The image source to attempt to load
- `alt: string` - The image alt text, when loaded
- `className: string` - The image class name, when loaded
- `style: string` - The image style, when loaded
- `retries: number` - The number of times to retry loading the image
- `interval: number` - The number of milliseconds to wait between retries
- `loadingContent: element` - Content to render while loading. Defaults to loading icon.
- `fallbackContent: element` - Content to render if all retries fail. Defaults to loading icon.
