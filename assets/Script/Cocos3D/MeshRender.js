const renderer = cc.renderer;
const Materials = require('Materials')
const math = renderer.renderEngine.math;
const gfx = renderer.renderEngine.gfx;

var vfmtMahjong = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
]);
vfmtMahjong.name = 'vfmtMahjong';

var meshData = require('mj_mesh')
function initRef(){

}
module.exports=cc.Class({
    extends: cc.RenderComponent,
    properties: {
        testMeshName:"",
        texture: {
            default: null,
            type: cc.SpriteFrame,
        },
        meshScaleX:1,
        meshScaleY:1,
        meshScaleZ:1,
        rot_x:0,
        rot_y:0,
        rot_z:0,
    },

    ctor: function () {
        this._vertexFormat = vfmtMahjong;
    },

    // use this for initialization
    onLoad: function () {
        this.node._scale.x = this.meshScaleX;
        this.node._scale.y = this.meshScaleY;
        this.node._scale.z = this.meshScaleZ;
        math.quat.fromEuler(this.node._quat,this.rot_x,this.rot_y,this.rot_z)
        this._activateMaterial();
        if(this.testMeshName!=""){
            this._meshData = meshData[this.testMeshName];
        }
    },

    _activateMaterial: function () {
        // Get material
        let texture = this.texture.getTexture();
        let url = texture.url;
        let key = url;
        var material = new Materials.SimpleMeshMaterial();
        material.setTexture(texture);
        material.updateHash();
        this._material = material;
    },
    
})._assembler = require('mesh-assembler');
