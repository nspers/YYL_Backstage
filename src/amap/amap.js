export default class AMapTool {
    /**
     * 加载地图js
     * @param {*} param 地图初始化参数
     */
    static async loadAndInit(param) {
        await new Promise((resolve, reject) => {
            if (window.AMap) {
                resolve(window.AMap);
            } else {
                var script = document.createElement('script');
                script.async = true;
                script.type = 'text/javascript';
                script.src = '//webapi.amap.com/maps?v=1.4.15&key=a3a9810bca5fbdb3fee6cd7c77fcd927&callback=AMapCallBack';
                script.onerror = reject;
                document.head.appendChild(script);
            }
            window.AMapCallBack = () => {
                resolve(window.AMap);
            }
        });
        return new AMapTool(param);
    };
    /**
     * 初始化地图+(地图初始化参数)
     * @param {*} id 地图容器domid
     * @param {*} center 地图中心经纬度
     * @param {*} zoom 地图级别
     * @param {*} zooms 地图级别范围
     * @param {*} plugin 地图插件
     */
    constructor({
        id = 'container',
        center = [116.386179, 39.943208],
        zoom = 17,
        zooms = [17, 20],
        plugin = ['AMap.MarkerClusterer'],
        limit = true
    }) {
        if (!AMap) {
            console.error('缺少地图js文件');
            return;
        }
        if (!document.getElementById(id)) {
            console.error(`缺少地图容器: ${id}`);
            return;
        }

        this.markers = [];
        this.center = center;
        this.zoom = zoom;

        var self = this;

        // 地图网格
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 256;

        var ctx = canvas.getContext("2d");

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#bbb";

        ctx.strokeRect(0, 0, 256, 256);

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#ccc";
        for (let i = 1; i < 8; i++) {
            ctx.moveTo(0, 32 * i);
            ctx.lineTo(256, 32 * i);

            ctx.moveTo(32 * i, 0);
            ctx.lineTo(32 * i, 256);
        }
        ctx.stroke();
        var canvasUrl = canvas.toDataURL();

        // 网格图层
        var gridLayer = new AMap.TileLayer.Flexible({
            zIndex: 0,
            createTile: function(x, y, z, success, fail) {
                var img = document.createElement('img');

                img.src = canvasUrl;
                success(img);
            }
        });

        // 自定义图层
        var tileLayer = new AMap.TileLayer({
            zIndex: 9,
            getTileUrl: function(a, r, c) {
                var t = 511,
                    n = 256,
                    o = 106884,
                    i = 49133;
                var l = c - 16,
                    s = Math.pow(2, l),
                    d = a - t * s - o * (2 * (l - 1)),
                    u = r - n * s - i * (2 * (l - 1));
                1 === l ? (d = a - t * s - o,
                    u = r - n * s - i) : 2 === l ? (d = a - t * s - o * (2 * (l - 1)),
                    u = r - n * s - i * (2 * (l - 1))) : 3 === l ? (d = a - t * s - o * (2 * (l - 1)),
                    u = r - n * s - i * (2 * (l - 1))) : 4 === l && (d = a - t * s - o * (2 * l),
                    u = r - n * s - i * (2 * l));
                var m = 'http://localhost:9999/yangyanlu/map' + l + "/" + d + "," + u + ".jpg";
                return m;
            },
            // 'http://118.190.216.41/map/yangyanlu/[z]/[y]/[x].png'
            getTileUrl: 'http://223.71.14.41:9800/map/[z]/[y]/[x].png'
        });

        // 卫星和路网图层
        this.satellite = new AMap.TileLayer({
            getTileUrl: 'https://mt{1,2,3,0}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile'
        });
        this.roadNet = new AMap.TileLayer.RoadNet();

        this.amap = new AMap.Map(id, {
            center,
            zoom,
            zooms,
            animateEnable: true,
            resizeEnable: true,
            expandZoomRange: true,
            layers: [gridLayer, tileLayer],
            jogEnable: false
        });
        this.amap.plugin(plugin, function() {});
        this.amap.on('click', function(e) {
            console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat())
        });
        this.amap.on('mousewheel', function(e) {
            self.mousewheelLng = e.lnglat.getLng();
            self.mousewheelLat = e.lnglat.getLat();

            setTimeout(function() {
                this.mousewheelLng = null;
                this.mousewheelLat = null;
            }, 1000);
        });
        limit && this.setLimitBounds(
            [119.734476, 34.140279], [119.833653, 34.193719]
        );

        return this;
    };
    /**
     * 增加卫星及路网图层
     */
    loadLayer() {
        this.satellite.setMap(this.amap);
        this.roadNet.setMap(this.amap);
    };
    /**
     * 移除卫星及路网图层
     */
    removeLayer() {
        this.satellite.setMap(null);
        this.roadNet.setMap(null);
    };
    /**
     * 还原地图到初始状态
     */
    resetMapStatus() {
        var center = this.center;

        if (this.mousewheelLng) {
            center = [this.mousewheelLng, this.mousewheelLat];
            this.mousewheelLng = null;
            this.mousewheelLat = null;
        }
        this.setCenterAndZoom(center, this.zoom);
    };
    /**
     * 设置地图经纬度和级别
     * @param {*} center 
     * @param {*} zoom 
     */
    setCenterAndZoom(center, zoom) {
        this.amap.setCenter(center);
        zoom && this.amap.setZoom(zoom);
    };
    /**
     * 限制地图显示区域
     * @param {*} southWest 西南坐标
     * @param {*} northEast 东北坐标
     */
    setLimitBounds(southWest, northEast) {
        var bounds = new AMap.Bounds(new AMap.LngLat(...southWest), new AMap.LngLat(...northEast));
        this.amap.setLimitBounds(bounds);
    };
    /**
     * 在地图上添加一个点
     * @param {*} lng 经度
     * @param {*} lat 纬度
     * @param {*} imageUrl 图标url
     * @param {*} offsetX x轴偏移量
     * @param {*} offsetY y轴偏移量
     * @param {*} visible 是否显示
     * @param {*} text 点的文本
     * @param {*} textClass 文本样式
     * @param {*} data 点的数据
     * @param {*} click 点的点击事件
     */
    addMarker({
        lng = this.amap.getCenter().getLng(),
        lat = this.amap.getCenter().getLat(),
        imageUrl = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        width,
        height,
        offsetX = -26,
        offsetY = -60,
        anchor = 'bottom-left',
        visible = true,
        text,
        textClass,
        data = {},
        click,
        drag
    }) {
        if (text) {
            data.text = text;
        }

        data.imageUrl = imageUrl;

        var marker = new AMap.Marker({
            map: this.amap,
            visible,
            draggable: drag ? true : false,
            cursor: drag ? 'move' : 'pointer',
            anchor,
            extData: data,
            topWhenClick: true,
            position: new AMap.LngLat(lng, lat),
            offset: new AMap.Pixel(offsetX, offsetY),
            content: createMarkerHTML({ text, textClass, imageUrl, imageWidth: width, imageHeight: height })
        });

        click && marker.on("click", function(e) {
            try {
                click(e.target);
            } catch (e) {
                console.error('error in marker click event, ', e);
            }
        });

        drag && marker.on("dragend", function(e) {
            try {
                drag(e.target);
            } catch (e) {
                console.error('error in marker drag event, ', e);
            }
        });

        this.markers.push(marker);

        return marker;
    };
    /**
     * 更新marker图片
     * @param {*} ids 为id数组 
     * @param {*} imageUrl 为图片url
     */
    updateMarkerImage({
        id,
        width,
        height,
        offsetX,
        offsetY,
        textClass,
        imageUrl = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png'
    }) {
        var self = this;
        var marker = this.markers.find(marker => id == marker.getExtData().id);

        if (marker) {
            var text = marker.getExtData().text;

            if (marker.getExtData().imageUrl === imageUrl) {
                return;
            } else {
                marker.getExtData().imageUrl = imageUrl;
            }

            if (typeof(offsetX) !== "undefined" && typeof(offsetY) !== "undefined") {
                marker.setOffset(new AMap.Pixel(offsetX, offsetY));
            }
            marker.setContent(createMarkerHTML({ text, textClass, imageUrl, imageWidth: width, imageHeight: height }));
        }
    };
    /**
     * 删除地图上所有点
     */
    removeAllMarkers() {
        this.amap.remove(this.markers);
        this.markers = [];
    };
    /**
     * 对当前地图上所有点进行聚合static\data\image\marker.png
     */
    setAllMarkerCluster() {
        if (!AMap.MarkerClusterer) {
            return null;
        }
        this.cluster = new AMap.MarkerClusterer(this.amap, this.markers, {
            maxZoom: 18,
            renderClusterMarker: function(context) {
                context.marker.setOffset(new AMap.Pixel(-28, -62));
                context.marker
                    .setContent(`<div class="amap-marker-cluster">${context.count}</div>`);
            }
        });
        return this.cluster;
    };
    destroy() {};
}
/**
 * 生成marker的html
 * @param {*} param0 
 */
function createMarkerHTML({ text, textClass, imageUrl = '', imageWidth, imageHeight }) {
    var html = ['<div class="amap-marker-container">'];

    if (text) {
        html.push(`<div class="amap-marker-text ${textClass?textClass:''}">${text}</div>`);
    }
    html.push(`<img class="amap-marker-image" width="${imageWidth||'auto'}" height="${imageHeight||'auto'}" src="${imageUrl}" /></div>`);

    return html.join('');
}