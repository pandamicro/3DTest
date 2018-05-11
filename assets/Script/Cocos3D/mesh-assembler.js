const renderer = cc.renderer
var math = renderer.renderEngine.math
const RenderData = renderer.renderEngine.RenderData;
const vec3 = math.vec3;

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
    let renderData = meshRender._renderData;
    let meshData = meshRender._meshData;
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
    let meshData = meshRender._meshData;
    let length = renderData.dataLength;
    let tempVert = {}
    for (let i = 0; i < length; i++) {
        let vert = data[i];
        vec3.transformMat4(tempVert,vert,matrix);
        vbuf[index + 0] = tempVert.x;
        vbuf[index + 1] = tempVert.y;
        vbuf[index + 2] = tempVert.z;
        vbuf[index + 3] = vert.u;
        vbuf[index + 4] = vert.v;
        uintbuf[index + 5] = color;
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

module.exports = {
    useModel: false,
    updateRenderData (meshRender) {
        if(!meshRender._meshData){
            return;
        }
        // Create render data if needed
        let renderData = meshRender._renderData;
        if (!renderData) {
            renderData = RenderData.alloc();
            let meshData = meshRender._meshData;
            renderData.dataLength = meshData.vert_x.length;
            renderData.vertexCount = meshData.vert_x.length;
            renderData.indiceCount = meshData.idx.length;
            renderData.material = meshRender.getMaterial();
            meshRender._renderData = renderData;
        }
        // 需要强制设置为 dirty 吗？
        renderData.vertDirty = true;
        if (renderData.uvDirty) {
            updateUVs(meshRender);
        }
        if (renderData.vertDirty) {
            updateVerts(meshRender);
        }
    },
    fillBuffers (comp, renderer) {
        // 动态获取 buffer
        let buffer = renderer.getBuffer('mesh', comp._vertexFormat),
            vertexOffset = buffer.byteOffset >> 2,
            vbuf = buffer._vData,
            uintbuf = buffer._uintVData;
        
        let ibuf = buffer._iData,
            indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;

        // 请求足够的 buffer 空间
        buffer.request(comp._renderData.vertexCount, comp._renderData.indiceCount);
            
        // 填充 buffer
        fillVertexBuffer(comp, vertexOffset, vbuf, uintbuf);
        fillIndexBuffer(comp, indiceOffset, vertexId, ibuf);

        // Force update render data every frame
        comp.node._renderFlag |= cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
};