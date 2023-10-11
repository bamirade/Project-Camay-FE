const ColorThief = {
  getColor: (image: string): Promise<[number, number, number]> => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const imageElement = new Image();
    imageElement.crossOrigin = "anonymous";

    return new Promise((resolve, reject) => {
      imageElement.onload = () => {
        if (context) {
          canvas.width = imageElement.width;
          canvas.height = imageElement.height;
          context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const pixelCount = imageData.data.length / 4;

          let totalR = 0;
          let totalG = 0;
          let totalB = 0;

          for (let i = 0; i < pixelCount; i++) {
            totalR += imageData.data[i * 4];
            totalG += imageData.data[i * 4 + 1];
            totalB += imageData.data[i * 4 + 2];
          }

          const averageR = Math.round(totalR / pixelCount);
          const averageG = Math.round(totalG / pixelCount);
          const averageB = Math.round(totalB / pixelCount);

          resolve([averageR, averageG, averageB]);
        } else {
          reject(new Error("Canvas context is null"));
        }
      };

      imageElement.src = image;
    });
  },
};

export default ColorThief;
