cc.macro.ENABLE_3D = true;

module.exports=cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        testData: {
            default: 1,
            type: cc.Float
        },
        testArr: {
            default: [],
            type: [cc.Float]
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text+":"+this.testData;
    },

    // called every frame
    update: function (dt) {

    },
});
