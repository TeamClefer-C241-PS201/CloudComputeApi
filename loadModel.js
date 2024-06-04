const tf = require('@tensorflow/tfjs-node');

// async function loadModel() {
//     return tf.loadLayersModel(process.env.MODEL_URL);
// }

async function loadModel() {
    const model = await tf.loadLayersModel(process.env.MODEL_URL);
    return model;
}


module.exports = loadModel;