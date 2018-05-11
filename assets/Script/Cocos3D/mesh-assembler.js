const renderer = cc.renderer
var math = renderer.renderEngine.math
const RenderData = renderer.renderEngine.RenderData;
const vec3 = math.vec3

function update(meshRender){
    let renderData = meshRender._renderData;
    if (renderData.uvDirty) {
        updateUVs(meshRender);
    }
    if (renderData.vertDirty) {
        updateVerts(meshRender);
    }
}
function updateUVs(meshRender)
{
    let material = meshRender.getMaterial();
    let renderData = meshRender._renderData;

    if (material && renderData) {
        let data = renderData._data;
        let meshData = meshRender._meshData
        let length = renderData.dataLength;
        let uv_x = meshData.uv_x;
        let uv_y = meshData.uv_y;
        for (let i = 0; i < length; i++) {
            data[i].u = uv_x[i];
            //data[i].v = 1-uv_y[i];
            data[i].v = uv_y[i];
        }
        renderData.uvDirty = false;
        return;
    }
}
function updateVerts(meshRender)
{
    let renderData = meshRender._renderData
    let meshData = meshRender._meshData
    let data = renderData._data;
    let length = renderData.dataLength;
    let vert_x = meshData.vert_x;
    let vert_y = meshData.vert_y;
    let vert_z = meshData.vert_z;
    for (let i = 0; i < length; i++) {
        data[i].x = vert_x[i];
        data[i].y = vert_y[i];
        data[i].z = vert_z[i];
    }
    renderData.vertDirty = false;
    return;
}
function fillVertexBuffer(meshRender, index, vbuf, uintbuf)
{
    let node = meshRender.node;
    let renderData = meshRender._renderData;
    let data = renderData._data;
    let color = node._color._val;
    
    node._updateWorldMatrix();
    let matrix = node._worldMatrix;
    let meshData = meshRender._meshData
    let length = renderData.dataLength;
    let tempVert = {}
    for (let i = 0; i < length; i++) {
        let vert = data[i];
        vec3.transformMat4(tempVert,vert,matrix)
        vbuf[index + 0] = tempVert.x;
        vbuf[index + 1] = tempVert.y;
        vbuf[index + 2] = tempVert.z;
        vbuf[index + 4] = vert.u;
        vbuf[index + 5] = vert.v;
        uintbuf[index + 3] = color;
        index += 6;
    }
}
function fillIndexBuffer (meshRender, offset, vertexId, ibuf) {
    let renderData = meshRender._renderData;
    let meshData = meshRender._meshData
    let indiceCount = renderData.indiceCount;
    for (let i = 0; i < indiceCount; i++) {
        ibuf[offset + i] = vertexId + meshData.idx[i];
    }
    return;
}

module.exports = cc.js.addon({
    useModel: false,
    datas: [],
    updateRenderData (meshRender) {
        this.datas.length = 0;
        if(!meshRender._meshData){
            return this.datas;
        }
        // Create render data if needed
        if (!meshRender._renderData) {
            let renderData = RenderData.alloc();
            let meshData = meshRender._meshData;
            renderData.dataLength = meshData.vert_x.length;
            renderData.vertexCount = meshData.vert_x.length;
            renderData.indiceCount = meshData.idx.length;
            meshRender._renderData = renderData
        }
        let renderData = meshRender._renderData;
        renderData.vertDirty = true;
        renderData.material = meshRender.getMaterial();
        update(meshRender);
        this.datas.push(renderData);
        return this.datas;
    },
    fillBuffers (meshRender, batchData, vertexId, vbuf, uintbuf, ibuf) {
        let vertexOffset = batchData.byteOffset / 4,
            indiceOffset = batchData.indiceOffset;
        fillVertexBuffer(meshRender, vertexOffset, vbuf, uintbuf);
        fillIndexBuffer(meshRender, indiceOffset, vertexId, ibuf);
    }
});