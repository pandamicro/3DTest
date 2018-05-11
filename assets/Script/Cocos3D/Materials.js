 
const renderEngine = cc.renderer.renderEngine;
var renderer = renderEngine.renderer;
var Material = renderEngine.Material;

//const MeshRender = require('MeshRender')
function SimpleMeshMaterial () {
  Material.call(this, false);
  
  var pass = new renderer.Pass('sprite');
  pass.setDepth(false, false);
  pass.setCullMode(1029);//gfx.CULL_NONE   CULL_BACK
  pass.setBlend(
    32774,
    770,771,
    32774,
    770,771
  );
// pass.setBlend(
//     32774,//gfx.BLEND_FUNC_ADD,

//     770,/*gfx.BLEND_SRC_ALPHA*/,771,// gfx.BLEND_ONE_MINUS_SRC_ALPHA,
//     32774,//gfx.BLEND_FUNC_ADD,
//     770,/*gfx.BLEND_SRC_ALPHA*/,771,// gfx.BLEND_ONE_MINUS_SRC_ALPHA
//   );
  let mainTech = new renderer.Technique(
    ['transparent'],
    [
      { name: 'texture', type: 13/*renderer.PARAM_TEXTURE_2D*/ },
    ],
    [
      pass
    ]
  );

  this._effect = new renderer.Effect(
    [
      mainTech,
    ],
    {},
    [
      { name: 'useTexture', value: true },
      { name: 'useModel', value: false },
      { name: 'alphaTest', value: false },
    ]
  );
  this.effect = this._effect;
  this._mainTech = mainTech;
}

cc.js.extend(SimpleMeshMaterial, Material);

cc.js.mixin(SimpleMeshMaterial.prototype, {
  getEffect:function(){
    return this._effect;
  },
  getTexture:function(){
    return this._effect.getProperty('texture');
  },
  setTexture:function(val){
    if (this._texture !== val) {
      this._texture = val;
      this._texture.setFlipY(true);
      this._effect.setProperty('texture', val.getImpl());
      this._texIds['texture'] = val.getId();
    }
  },
});

module.exports = {
    SimpleMeshMaterial:SimpleMeshMaterial
}
