var resources = { textures: {} };

{
  let atlasKeys = Object.keys(atlases);
  let texturePack = {};
  for (let i = 0; i < atlasKeys.length; ++i) {
    let atlas = atlases[atlasKeys[i]];
    let keys = Object.keys(atlas.textures);
    for (let j = 0; j < keys.length; ++j) {
      let tex = atlas.textures[keys[j]];
      let texName = keys[j];
      createPaperTexture(tex);
      texturePack[texName] = tex;
    }
  }
  resources.textures = texturePack;
}
