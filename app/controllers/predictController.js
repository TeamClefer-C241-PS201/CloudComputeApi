// const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const crypto = require('crypto');
// const { Firestore } = require('@google-cloud/firestore');

// // Create a Firestore instance
// const db = new Firestore();

// const router = express.Router();

const getClassification = async (model, image) => {
    try {
        const tensor = tf.node
            .decodeJpeg(image.buffer)
            .resizeNearestNeighbor([256, 256])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        // const score = await prediction.data();
        // const confidenceScore = Math.max(...score) * 100;

        const classes = ['Blight', 'Common_Rust', 'Gray_Leaf_Spot', 'Healthy'];
        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        let result, description, suggestion;

        if (label === 'Blight') {
            result = "BULAI"
            description = "Penyakit jagung bulai, juga dikenal sebagai penyakit bercak daun Helminthosporium atau Drechslera (HD), merupakan salah satu penyakit utama yang menyerang tanaman jagung di seluruh dunia. Penyakit ini dapat menyebabkan kerusakan signifikan pada hasil panen, dengan tingkat keparahan yang bervariasi tergantung pada strain jamur, kondisi lingkungan, dan kerentanan tanaman."
            suggestion = "Gunakan fungisida yang direkomendasikan untuk mengendalikan penyakit bulai jagung. Perhatikan dosis dan waktu aplikasi yang tepat sesuai dengan petunjuk penggunaan.";
        } 
        
        if (label === 'Common_Rust') {
            result = "KARAT DAUN"
            description = "Penyakit common rust (karat daun) dan bercak daun pada jagung, yang disebabkan oleh jamur Puccinia sorghi dan Helminthosporium maydis (Drechslera zeae), dapat menyebabkan kerusakan signifikan pada hasil panen."
            suggestion = "Untuk mengendalikan penyakit karat pada jagung, tanamlah varietas tahan, atur jarak tanam, tanam di awal musim kemarau, dan gunakan pestisida kimiawi jika diperlukan.";
        }
        
        if (label === 'Gray_Leaf_Spot') {
            result = "HAWAR DAUN"
            description = "Penyakit hawar daun jagung, juga dikenal sebagai penyakit Exserohilum turcicum atau Helminthosporium turcicum, merupakan salah satu penyakit utama yang menyerang tanaman jagung di seluruh dunia. Penyakit ini dapat menyebabkan kerusakan signifikan pada hasil panen, dengan tingkat keparahan yang bervariasi tergantung pada strain jamur, kondisi lingkungan, dan kerentanan tanaman."
            suggestion = "Untuk mengatasi hawar daun pada tanaman jagung, lakukan sanitasi lahan, gunakan varietas tahan, atur waktu tanam dan jarak tanam, terapkan pengendalian hayati, dan lakukan perlakuan benih dengan metalaksil dan pupuk NPK berkadar Nordox56WP. Langkah-langkah ini bertujuan untuk menekan sumber inokulum, meningkatkan ketahanan tanaman, dan menciptakan lingkungan mikro yang tidak mendukung perkembangan penyakit. Penggunaan varietas tahan dan pengendalian hayati menjadi pilihan utama, sedangkan perlakuan benih dapat dilakukan sebagai langkah preventif tambahan.";
        }
        
        if (label === 'Healthy') {
            suggestion = "Tanaman jagung anda sehat!.";
        }

        return { label, result, description, suggestion };
    } catch (error) {
        throw new Error(`Terjadi kesalahan dalam input: ${error.message}`);
    }
};

const getPredictions = async (req, res) => {
    try {
        const { file } = req; // Assuming the image is sent in the body. Adjust this as per your requirement.
        const { model } = req.app.locals; // Assuming the model is stored in app locals.

        if (!file) {
            return res.status(400).json({ status: 'error', message: 'Data Gambar Diperlukan' });
        }

        const { result, description, suggestion } = await getClassification(model, file);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            "result" : result,
            "description" : description,
            "suggestion" : suggestion,
            createdAt
        }

        res.status(201).json({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

module.exports = { getPredictions };
