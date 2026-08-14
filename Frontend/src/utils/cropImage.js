export const PRODUCT_IMAGE_ASPECT = 3 / 4;
export const PRODUCT_IMAGE_WIDTH = 900;
export const PRODUCT_IMAGE_HEIGHT = 1200;

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export async function getCroppedProductImage(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = PRODUCT_IMAGE_WIDTH;
  canvas.height = PRODUCT_IMAGE_HEIGHT;

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = bBoxWidth;
  tempCanvas.height = bBoxHeight;

  tempCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
  tempCtx.rotate(rotRad);
  tempCtx.translate(-image.width / 2, -image.height / 2);
  tempCtx.drawImage(image, 0, 0);

  const data = tempCtx.getImageData(
    Math.round(pixelCrop.x),
    Math.round(pixelCrop.y),
    Math.round(pixelCrop.width),
    Math.round(pixelCrop.height)
  );

  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = Math.round(pixelCrop.width);
  cropCanvas.height = Math.round(pixelCrop.height);
  cropCanvas.getContext('2d').putImageData(data, 0, 0);

  ctx.drawImage(
    cropCanvas,
    0,
    0,
    cropCanvas.width,
    cropCanvas.height,
    0,
    0,
    PRODUCT_IMAGE_WIDTH,
    PRODUCT_IMAGE_HEIGHT
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/jpeg',
      0.92
    );
  });
}

export async function blobToFile(blob, filename = 'product.jpg') {
  return new File([blob], filename, { type: 'image/jpeg' });
}
