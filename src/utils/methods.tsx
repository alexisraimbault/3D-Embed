import { Area } from "react-easy-crop";

const hexToRgb = (hexColor: string) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const cloneDeep = (o: Object) => JSON.parse(JSON.stringify(o))

const readFile = (file: File) => {
    return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const readerResult = reader.result
            if (readerResult === undefined || readerResult === null) {
                return
            }
            resolve(readerResult.toString())
        }, false);
        reader.readAsDataURL(file);
    });
};

const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', error => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

const RGBToGrayScale = (red: number, green: number, blue: number) => {
    //return red * 0.2126 + green * 0.7152 + blue * 0.0722;
    return (red * 6966 + green * 23436 + blue * 2366) >> 15;
}

const getCroppedImg = async (
    imageSrc: string,
    areaCrop: Area,
) => {
    const image: HTMLImageElement = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    const bBoxWidth = image.width
    const bBoxHeight = image.height

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const imgData = ctx.getImageData(areaCrop.x, areaCrop.y, areaCrop.width, areaCrop.height);
    const pixels = imgData.data;
    for (var i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        const grayscale = RGBToGrayScale(red, green, blue)
        pixels[i] = grayscale;
        pixels[i + 1] = grayscale;
        pixels[i + 2] = grayscale;
    }

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = areaCrop.width;
    canvas.height = areaCrop.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(imgData, 0, 0);

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise<{ file: Blob, url: string }>(resolve => {
        canvas.toBlob(file => {
            if (file === null || file === undefined) {
                return
            }
            resolve({ file, url: URL.createObjectURL(file) });
        }, 'image/jpeg');
    });
};

export {
    hexToRgb,
    cloneDeep,
    readFile,
    createImage,
    getCroppedImg,
}
