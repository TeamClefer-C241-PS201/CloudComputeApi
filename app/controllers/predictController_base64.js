const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const crypto = require('crypto');
const db = require('../config/dbConfig');
// const { Firestore } = require('@google-cloud/firestore');

// // Create a Firestore instance
// const db = new Firestore();

// const router = express.Router();

const getClassification = async (model, imageBuffer) => {
    try {
        const tensor = tf.node
            .decodeJpeg(imageBuffer)
            .resizeNearestNeighbor([256, 256])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const classes = ['Blight', 'Common_Rust', 'Gray_Leaf_Spot', 'Healthy'];
        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        let result, description, suggestion;

        if (label === 'Blight') {
            result = "HAWAR DAUN JAGUNG (BULAI)"
            description = "Penyakit jagung bulai, juga dikenal sebagai penyakit bercak daun Helminthosporium atau Drechslera (HD), merupakan salah satu penyakit utama yang menyerang tanaman jagung di seluruh dunia. Penyakit ini dapat menyebabkan kerusakan signifikan pada hasil panen, dengan tingkat keparahan yang bervariasi tergantung pada strain jamur, kondisi lingkungan, dan kerentanan tanaman."
            suggestion = "Gunakan fungisida yang direkomendasikan untuk mengendalikan penyakit bulai jagung. Perhatikan dosis dan waktu aplikasi yang tepat sesuai dengan petunjuk penggunaan.";
        }

        if (label === 'Common_Rust') {
            result = "KARAT DAUN JAGUNG"
            description = "Penyakit common rust (karat daun) dan bercak daun pada jagung, yang disebabkan oleh jamur Puccinia sorghi dan Helminthosporium maydis (Drechslera zeae), dapat menyebabkan kerusakan signifikan pada hasil panen."
            suggestion = "Untuk mengendalikan penyakit karat pada jagung, tanamlah varietas tahan, atur jarak tanam, tanam di awal musim kemarau, dan gunakan pestisida kimiawi jika diperlukan.";
        }

        if (label === 'Gray_Leaf_Spot') {
            result = "BERCAK DAUN JAGUNG"
            description = "Penyakit bercak daun pada jagung atau gray leaf spot adalah penyakit tanaman yang disebabkan oleh jamur Cercospora zeae-maydis. Penyakit ini umum ditemukan pada tanaman jagung dan dapat menyebabkan kerugian hasil panen yang signifikan."
            suggestion = "Untuk mengatasi hawar daun pada tanaman jagung, lakukan sanitasi lahan, gunakan varietas tahan, atur waktu tanam dan jarak tanam, terapkan pengendalian hayati, dan lakukan perlakuan benih dengan metalaksil dan pupuk NPK berkadar Nordox56WP. Langkah-langkah ini bertujuan untuk menekan sumber inokulum, meningkatkan ketahanan tanaman, dan menciptakan lingkungan mikro yang tidak mendukung perkembangan penyakit. Penggunaan varietas tahan dan pengendalian hayati menjadi pilihan utama, sedangkan perlakuan benih dapat dilakukan sebagai langkah preventif tambahan.";
        }

        if (label === 'Healthy') {
            result = "Tanaman jagung anda sehat!."
            description = "Tanaman jagung yang sehat memiliki beberapa ciri yang dapat diidentifikasi, salah satunya adalah dari daunnya. Daunnya berwarna hijau tua dan segar, tanpa tanda-tanda menguning atau bercak-bercak yang menunjukkan adanya penyakit. "
            suggestion = "Menangani penyakit gray leaf spot pada jagung melibatkan penggunaan varietas tahan penyakit, praktik agronomi yang baik, pemantauan rutin, aplikasi fungisida tepat waktu, dan pengelolaan kelembaban.  ";
        }

        return { label, result, description, suggestion };
    } catch (error) {
        throw new Error(`Terjadi kesalahan dalam input: ${error.message}`);
    }
};

const getPredictions = async (req, res) => {
    try {
        const { base64Image } = req.body; // Assuming the image is sent as base64 string in the body.
        const { model } = req.app.locals; // Assuming the model is stored in app locals.

        if (!base64Image) {
            return res.status(400).json({error:true, status: 'error', message: 'Data Gambar Diperlukan' });
        }

        // Decode base64 to buffer
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const { label, result, description, suggestion } = await getClassification(model, imageBuffer);

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        let articleId;
        if (label === 'Blight') {
            articleId = 1;
        } else if (label === 'Common_Rust') {
            articleId = 2;
        } else if (label === 'Gray_Leaf_Spot') {
            articleId = 3;
        } else if (label === 'Healthy') {
            articleId = 4;
        }

        const [articles] = await db.execute('SELECT * from articles WHERE articleId=?', [articleId]);

        if (!articles) {
            return res.status(404).json({error:true, status: 'error', message: 'Article not found' });
        }

        const article = articles[0];

        const data = {
            id,
            result,
            description,
            suggestion,
            articleTitle: article.articleTitle,
            articleDesc: article.articleDesc,
            articleImg: article.articleImg,
            createdAt
        };

        res.status(201).json({error:false,
            status: 'success',
            message: 'Model is predicted successfully',
            data
        });
    } catch (error) {
        res.status(500).json({error:true,
            status: 'error',
            message: error.message
        });
    }
}

module.exports = { getPredictions };
