import amap from './amap.js';
import Vue from 'vue';
import store from '../store'

//地图创建
export function createMap(id, fun) {
    // 防止重复初始化
    if (window.amap) {
        fun && fun();
        return;
    }
    amap.loadAndInit({ id, center: [119.778786, 34.168548], zooms: [15, 19], zoom: 15 }).then(amap => {
        window.amap = amap;
        fun && fun();
    });
}
export function mapWork(id, fun) {
    amap.loadAndInit({ id }).then(map => {
        fun && fun();
    });
}
export function getJWD(fun) {
    fun && fun();
}
export function bindDrawstartHandler(fun) {
    window.amap.amap.on('movestart', function(e) {
        fun && fun();
    });
}
export function bindDrawendHandler(fun) {
    window.amap.amap.on('moveend', function(e) {
        fun && fun();
    });
}

export function locationByJWD(obj) {
    // 还原地图
    if (obj.cameraHeight > 2000) {
        setTimeout(function() {
            window.amap && window.amap.resetMapStatus();
        }, 300);
    } else {
        // 点击调用
        window.amap && window.amap.setCenterAndZoom([obj.jd, obj.wd], 20);
    }
}

export class WorkCover {
    constructor(statusObj, imageConfig) {
        this.imageConfig = imageConfig;
        this.statusObj = statusObj;
        this.lastClickedMarkers = [];
        // 提前加载图片
        Object.keys(statusObj).forEach(k => {
            new Image().src = statusObj[k].noSelect;
            new Image().src = statusObj[k].isSelect;
        });
    };
    crate(type, opt) {
        var self = this;
        if (opt.isCluster) {
            self.cluster = window.amap.setAllMarkerCluster();
        }
    };
    addBillboard(cor, opt, obj) {
        var self = this;
        var imgUrl = this.statusObj[opt.status][opt.select];
        var marker = window.amap.addMarker({
            anchor: 'bottom-center',
            lng: cor.longitude,
            lat: cor.latitude,
            text: obj.text,
            textClass: obj.textClass,
            imageUrl: imgUrl,
            click: obj.click,
            width: self.imageConfig["noSelect"].width,
            height: self.imageConfig["noSelect"].height,
            offsetX: self.imageConfig["noSelect"].offsetX,
            offsetY: self.imageConfig["noSelect"].offsetY,
            data: {
                id: obj.id,
                opt
            }
        });
        marker.on("click", function(e) {
            // 更改当前点图标
            var marker = e.target;
            var data = marker.getExtData();

            // 防止重复点击
            if (self.lastClickedMarkers.length > 0 && data.id === self.lastClickedMarkers[0].getExtData().id) {
                return;
            }
            self.revertBillboardsStatus();
            setTimeout(function() {
                window.amap.updateMarkerImage({
                    id: data.id,
                    width: self.imageConfig["isSelect"].width,
                    height: self.imageConfig["isSelect"].height,
                    offsetX: self.imageConfig["isSelect"].offsetX,
                    offsetY: self.imageConfig["isSelect"].offsetY,
                    imageUrl: self.statusObj[data.opt.status]["isSelect"]
                });
            }, 800);
            self.lastClickedMarkers = [e.target];
        });
        if (self.cluster) {
            self.cluster.addMarker(marker);
        }
    };
    revertBillboardsStatus() {
        var self = this;

        if (self.lastClickedMarkers.length === 0) {
            resetMarkerStatus(window.amap.markers);
        } else {
            resetMarkerStatus(self.lastClickedMarkers);
            self.lastClickedMarkers = [];
        }
        // 恢复点的图标
        function resetMarkerStatus(markers) {
            markers.forEach(marker => {
                var data = marker.getExtData();

                if (data.opt) {
                    window.amap.updateMarkerImage({
                        id: data.id,
                        width: self.imageConfig["noSelect"].width,
                        height: self.imageConfig["noSelect"].height,
                        offsetX: self.imageConfig["noSelect"].offsetX,
                        offsetY: self.imageConfig["noSelect"].offsetY,
                        imageUrl: self.statusObj[data.opt.status]["noSelect"]
                    });
                }
            });
        }
    };
    changeBillBoardstatusAttr(id, status, selected, textClass) {
        var self = this;
        var marker = window.amap.markers.find(marker => marker.getExtData().id == id);

        if (marker) {
            marker.getExtData().opt.status = status;
        }
        window.amap.updateMarkerImage({
            id: id,
            textClass,
            width: self.imageConfig[selected].width,
            height: self.imageConfig[selected].height,
            offsetX: self.imageConfig[selected].offsetX,
            offsetY: self.imageConfig[selected].offsetY,
            imageUrl: self.statusObj[status][selected]
        });
    };
    updateSelById(id) {
        console.log('updateSelById:' + id);
    };
    destroy() {
        if (this.cluster) {
            this.cluster.clearMarkers();
            this.cluster = null;
        }

        window.amap.removeAllMarkers();

        this.statusObj = null;
        this.lastClickedMarkers = null;
    };
}