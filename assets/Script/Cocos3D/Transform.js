const renderer = cc.renderer
const Materials = require('Materials')
var SpriteMaterial = renderer.renderEngine.SpriteMaterial
const math = renderer.renderEngine.math;
var meshData = require('mj_mesh')
cc.Class({
    extends: cc.Component,
    properties: {
        localPosition:cc.Vec3,
        localScale:cc.Vec3,
        localRotate:cc.Vec3,
    },

    _activateMaterial: function () {
        // Get material
        let texture = this.texture.getTexture();
        let url = texture.url;
        let key = url;
        var material = new Materials.SimpleMeshMaterial();
        material.setTexture(texture.getImpl());
        material.updateHash();
        this._material = material;
    },
    
})._assembler = require('mesh-assembler');
