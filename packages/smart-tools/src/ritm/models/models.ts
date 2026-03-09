export const RITMModels = {
    main: new URL('./main.onnx', import.meta.url).toString(),
    preprocess: new URL('./preprocess.onnx', import.meta.url).toString(),
};
