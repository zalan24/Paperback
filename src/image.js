function getPixel(imageData, x, y) {
  let dataPerPixel = 4;
  let ind = (x + y * imageData.width) * dataPerPixel;
  if (ind < 0 || ind >= imageData.data.length)
    return { a: 0, r: 0, g: 0, b: 0 };
  return {
    r: imageData.data[ind] / 255,
    g: imageData.data[ind + 1] / 255,
    b: imageData.data[ind + 2] / 255,
    a: imageData.data[ind + 3] / 255
  };
}

function setPixel(imageData, x, y, pixel) {
  let dataPerPixel = 4;
  let ind = (x + y * imageData.width) * dataPerPixel;
  imageData.data[ind] = Math.floor(pixel.r * 255);
  imageData.data[ind + 1] = Math.floor(pixel.g * 255);
  imageData.data[ind + 2] = Math.floor(pixel.b * 255);
  imageData.data[ind + 3] = Math.floor(pixel.a * 255);
}

function foreachPixel(image, x, y, w, h, f) {
  for (let i = 0; i < w; ++i) {
    for (let j = 0; j < h; ++j) {
      setPixel(image, x + i, y + j, f(i, j));
    }
  }
}

function transformImage(fromImage, fromX, fromY, toImage, toX, toY, w, h, f) {
  foreachPixel(toImage, toX, toY, w, h, (x, y) =>
    f(getPixel(fromImage, x + fromX, y + fromY))
  );
}

function filterImage(
  fromImage,
  fromX,
  fromY,
  toImage,
  toX,
  toY,
  w,
  h,
  kernel,
  f
) {
  foreachPixel(toImage, toX, toY, w, h, (x, y) => {
    let sum = { a: 0, r: 0, g: 0, b: 0 };
    for (let i = -kernel; i <= kernel; ++i) {
      for (let j = -kernel; j <= kernel; ++j) {
        let r = getPixel(fromImage, x + fromX + i, y + fromY + j);
        let weight = f(i, j);
        sum.r += r.r * weight;
        sum.g += r.g * weight;
        sum.b += r.b * weight;
        sum.a += r.a * weight;
        // sum.forEach((s, i) => s + r[i] * weight);
      }
    }
    return sum;
  });
}

function getGaussFilter(standardDeviation) {
  return (x, y) =>
    Math.exp(-(x * x + y * y) / (2 * standardDeviation * standardDeviation)) /
    (2 * Math.PI * standardDeviation);
}
