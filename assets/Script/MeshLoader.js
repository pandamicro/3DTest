//const renderer = require('./renderer');
const renderEngine = cc.renderer.renderEngine;
const math = renderEngine.math;
cc.Class({
    extends: cc.Component,

    properties: {
        sprite: {
            default: null,
            type: cc.Sprite
        },
        // defaults, set visually when attaching this script to the Canvas
        mesh: '',
        z:0,
        fov:Math.PI/4.0,
        rot_x:0,
        rot_y:0,
        rot_z:0,
        size_x:500,
        size_y:500,
    },

    // use this for initialization
    onLoad: function () {
        // cc.renderer._camera._fov =this.fov;
        // cc.renderer._camera.setType(1);
        // cc.renderer._camera.setOrthoHeight(this.size_y);
        math.quat.fromEuler(this.sprite.node._quat,this.rot_x,this.rot_x,this.rot_z);

        this.sprite.node._position.z = this.z;
        this.sprite.node._scale.z = 2000;
        var meshData = require('mj_mesh');
        if(this.mesh!=""){
            this.sprite._mesh3D = meshData[this.mesh];
        }
    },

    // called every frame
    // update: function (dt) {

    // },
});
