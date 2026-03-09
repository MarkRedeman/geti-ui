export const SegmentAnythingModels = {
    encoder: new URL('./mobile_sam.encoder.onnx', import.meta.url).toString(),
    decoder: new URL('./sam_vit_h_4b8939.decoder.onnx', import.meta.url).toString(),
};
