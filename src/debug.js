console.log("time: " + new Date().toLocaleString());

var debugImage = atlases.test_atlas.textures.sword;

debugImage.onload = function() {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0, 0, 512, 512);

  debugImage.texture.img.onload = function() {
    console.log(
      "debugImage size: " +
        debugImage.texture.img.width +
        "x" +
        debugImage.texture.img.height
    );
    ctx.drawImage(debugImage.texture.img, 0, 0);
  };

  var testImage = document.getElementById("testImage");
  testImage.src = debugImage.texture.img.src;
};
