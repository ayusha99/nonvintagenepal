import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { RotateCw, ZoomIn, X, Check } from 'lucide-react';
import {
  PRODUCT_IMAGE_ASPECT,
  PRODUCT_IMAGE_WIDTH,
  PRODUCT_IMAGE_HEIGHT,
  getCroppedProductImage,
  blobToFile,
} from '../utils/cropImage';

function ProductImageCropper({ imageSrc, fileName, onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_area, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedProductImage(imageSrc, croppedAreaPixels, rotation);
      const file = await blobToFile(blob, fileName.replace(/\.\w+$/, '.jpg'));
      onComplete(file);
    } catch (err) {
      console.error('Crop failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
      <div className="fixed inset-0 bg-black/85" onClick={onCancel} />
      <div className="relative bg-[#0a0a0a] w-full max-w-md border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <button type="button" onClick={onCancel} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 font-bold">Adjust photo</p>
            <p className="text-[9px] text-white/40 mt-0.5">
              3:4 frame · {PRODUCT_IMAGE_WIDTH}×{PRODUCT_IMAGE_HEIGHT}px
            </p>
          </div>
          <button type="button" onClick={handleDone} disabled={processing} className="text-white disabled:opacity-40">
            <Check className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full bg-black" style={{ height: 'min(58vh, 480px)' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={PRODUCT_IMAGE_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            objectFit="contain"
          />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-white/50 font-bold">
                <ZoomIn className="w-3 h-3" /> Zoom
              </span>
              <span className="text-[9px] text-white/40">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-white/50 font-bold">
              <RotateCw className="w-3 h-3" /> Straighten
            </span>
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold text-white border border-white/20 hover:border-white/50"
            >
              Rotate 90°
            </button>
          </div>

          <p className="text-[9px] text-white/35 text-center leading-relaxed">
            Drag to reposition · pinch or slide to zoom · every product uses the same size & angle
          </p>

          <button
            type="button"
            onClick={handleDone}
            disabled={processing}
            className="w-full py-3 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-black hover:bg-gray-100 disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Use photo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductImageCropper;
