// Polyfill ImageData for jsdom environments that don't include canvas APIs
if (typeof ImageData === 'undefined') {
    class ImageDataPolyfill {
        readonly data: Uint8ClampedArray;
        readonly width: number;
        readonly height: number;

        constructor(widthOrData: number | Uint8ClampedArray, height: number, _settings?: ImageDataSettings) {
            if (typeof widthOrData === 'number') {
                this.width = widthOrData;
                this.height = height;
                this.data = new Uint8ClampedArray(widthOrData * height * 4);
            } else {
                this.data = widthOrData;
                this.width = height;
                this.height = widthOrData.length / (height * 4);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).ImageData = ImageDataPolyfill;
}
