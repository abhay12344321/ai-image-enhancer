// TensorFlow.js मॉडल लोड करें
let model;
async function loadModel() {
    model = await tf.loadGraphModel('https://tfhub.dev/captain-pool/esrgan-tf2/1');
    console.log("AI मॉडल लोड हो गया!");
}
loadModel();

// इमेज अपलोड करें
document.getElementById('uploadBtn').addEventListener('click', () => {
    document.getElementById('imageInput').click();
});

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('originalImage').src = e.target.result;
            document.getElementById('enhancedImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// ऑटो एन्हांस फंक्शन
async function autoEnhance() {
    const img = document.getElementById('originalImage');
    if (!img.src) {
        alert("पहले इमेज अपलोड करें!");
        return;
    }

    const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([img.width * 2, img.height * 2])
        .toFloat()
        .div(tf.scalar(255));

    const enhanced = await model.predict(tensor);
    const canvas = document.createElement('canvas');
    await tf.browser.toPixels(enhanced, canvas);
    document.getElementById('enhancedImage').src = canvas.toDataURL();
    tf.dispose([tensor, enhanced]);
}

// डाउनलोड फंक्शन
function downloadImage() {
    const img = document.getElementById('enhancedImage');
    if (!img.src) {
        alert("पहले इमेज एन्हांस करें!");
        return;
    }

    const link = document.createElement('a');
    link.download = 'enhanced-image.png';
    link.href = img.src;
    link.click();
}