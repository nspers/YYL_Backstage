<template>
  <div class="login_warp" style="overflow:hidden">
    <div id="large-header" style="height: 100%;">
      <canvas id="demo-canvas" width="100%" height="100%"></canvas>
    </div>
    <div ref="loginBox" class="login_box animated slideInRight">
      <div class="lb_title">
        <p>杨雁路物联网管控平台后台</p>
        <p>IOT Management Platform</p>
      </div>
      <form @submit.prevent="register">
        <div class="inputdiv userDiv">
          <input type="text" placeholder="请输入用户名" autofocus v-model="usename" />
        </div>
        <div class="inputdiv passwordDiv">
          <input type="password" placeholder="请输入密码" v-model="password" />
        </div>
        <div class="code_box">
          <input type="text" placeholder="请输入验证码" v-model="verification" />
          <img :src="verificationUrl" alt="验证码" @click="upodataImg()" />
        </div>

        <button>登 录</button>
      </form>
    </div>
    <div class="copyright">
      <img src="../assets/img/login/logo.png" alt="logo" />
      <span>数知（北京）物联科技有限公司</span>
    </div>
  </div>
</template>

<script>
import "../assets/js/TweenLite";
import "../assets/js/EasePack";
import { baseUrl } from "../config/env";
export default {
  name: "login",
  data() {
    return {
      usename: "",
      password: "",
      verification: "",
      verificationUrl: baseUrl + "/code/image"
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.pointerMove();
    });
  },
  methods: {
    upodataImg() {
      this.verificationUrl = baseUrl + "/code/image?" + Math.random();
    },
    register() {
      // window.sessionStorage.setItem('login',true)
      // this.$router.push({name:'index'})
      if (
        this.usename != "" &&
        this.password != "" &&
        this.verification != ""
      ) {
        var self = this;
        this.$api
          .post2(
            "/user/login",
            {
              username: this.usename,
              password: this.password,
              imageCode: this.verification
            },
            { emulateJSON: true, withCredentials: true }
          )
          .then(function(res) {
            if (res.code == 1) {
              window.sessionStorage.setItem("loginYYLBC", true);
              window.sessionStorage.setItem("userName", self.usename);
              self.$router.push({ name: "adbook" });
            }
          })
          .catch(res => {
            self.upodataImg();
          });
      } else {
        this.$Message.destroy();
        this.$Message.warning("请输入用户名、密码或者验证码");
      }
    },
    pointerMove() {
      let width,
        height,
        largeHeader,
        canvas,
        ctx,
        points,
        target,
        animateHeader = true;
      initHeader();
      initAnimation();
      addListeners();

      function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: width / 2, y: height / 2 };
        largeHeader = document.getElementById("large-header");
        console.log();
        largeHeader.style.height = height + "px";
        canvas = document.getElementById("demo-canvas");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        points = [];
        for (let x = 0; x < width; x = x + width / 20) {
          for (let y = 0; y < height; y = y + height / 20) {
            let px = x + (Math.random() * width) / 20;
            let py = y + (Math.random() * height) / 20;
            let p = { x: px, originX: px, y: py, originY: py };
            points.push(p);
          }
        }
        for (let i = 0; i < points.length; i++) {
          let closest = [];
          let p1 = points[i];
          for (let j = 0; j < points.length; j++) {
            let p2 = points[j];
            if (!(p1 == p2)) {
              let placed = false;
              for (let k = 0; k < 5; k++) {
                if (!placed) {
                  if (closest[k] == undefined) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }
              for (let k = 0; k < 5; k++) {
                if (!placed) {
                  if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }
            }
          }
          p1.closest = closest;
        }
        for (let i in points) {
          let c = new Circle(
            points[i],
            2 + Math.random() * 2,
            "rgba(255,255,255,0.3)"
          );
          points[i].circle = c;
        }
      }

      function addListeners() {
        if (!("ontouchstart" in window)) {
          window.addEventListener("mousemove", mouseMove);
        }
        window.addEventListener("scroll", scrollCheck);
        window.addEventListener("resize", resize);
      }

      function mouseMove(e) {
        let posx = 0;
        let posy = 0;
        if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
        } else {
          if (e.clientX || e.clientY) {
            posx =
              e.clientX +
              document.body.scrollLeft +
              document.documentElement.scrollLeft;
            posy =
              e.clientY +
              document.body.scrollTop +
              document.documentElement.scrollTop;
          }
        }
        target.x = posx;
        target.y = posy;
      }

      function scrollCheck() {
        document.body.scrollTop > height
          ? (animateHeader = false)
          : (animateHeader = true);
      }

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height + "px";
        canvas.width = width;
        canvas.height = height;
      }

      function initAnimation() {
        animate();
        for (let i in points) {
          shiftPoint(points[i]);
        }
      }

      function animate() {
        if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (let i in points) {
            if (Math.abs(getDistance(target, points[i])) < 4000) {
              points[i].active = 0.3;
              points[i].circle.active = 0.6;
            } else {
              if (Math.abs(getDistance(target, points[i])) < 20000) {
                points[i].active = 0.1;
                points[i].circle.active = 0.3;
              } else {
                if (Math.abs(getDistance(target, points[i])) < 40000) {
                  points[i].active = 0.02;
                  points[i].circle.active = 0.1;
                } else {
                  points[i].active = 0;
                  points[i].circle.active = 0;
                }
              }
            }
            drawLines(points[i]);
            points[i].circle.draw();
          }
        }
        requestAnimationFrame(animate);
      }

      function shiftPoint(p) {
        TweenLite.to(p, 1 + 1 * Math.random(), {
          x: p.originX - 50 + Math.random() * 100,
          y: p.originY - 50 + Math.random() * 100,
          ease: Circ.easeInOut,
          onComplete: function() {
            shiftPoint(p);
          }
        });
      }

      function drawLines(p) {
        if (!p.active) {
          return;
        }
        for (let i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = "rgba(156,217,249," + p.active + ")";
          ctx.stroke();
        }
      }

      function Circle(pos, rad, color) {
        let _this = this;
        (function() {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
        })();
        this.draw = function() {
          if (!_this.active) {
            return;
          }
          ctx.beginPath();
          ctx.arc(
            _this.pos.x,
            _this.pos.y,
            _this.radius,
            0,
            2 * Math.PI,
            false
          );
          ctx.fillStyle = "rgba(156,217,249," + _this.active + ")";
          ctx.fill();
        };
      }

      function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.loginBox.className = "login_box animated slideOutRight";
    setTimeout(() => {
      next();
    }, 800);
  }
};
</script>

<style lang="scss" scoped>
.login_warp {
  width: 100vw;
  height: 100vh;
  background: #000 url("../assets/img/login/login_bg.png") no-repeat
    center/cover;
  color: #fff;
  text-shadow: none;
  // position: relative;

  .login_box {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0.82rem;
    margin: auto 0;
    // width: 6.37rem;
    // height: 7.93rem;
    // background: url("../assets/img/login/login_box_bg.png") no-repeat
    //   center/contain;
    width: 6.37rem;
    height: 7.93rem;
    background: linear-gradient(
      0deg,
      rgba(54, 173, 214, 1) 0%,
      rgba(54, 172, 214, 0) 100%
    );
    border: 0.02rem solid rgba(5, 35, 144, 0.3);
    box-shadow: 0rem 0.03rem 0.29rem 0.1rem rgba(6, 79, 177, 0.83);
    border-radius: 0.05rem;

    .lb_title {
      padding-top: 0.53rem;
      width: 100%;
      height: 1.28rem;
      text-align: center;
      box-sizing: border-box;
      p:nth-child(1) {
        font-size: 0.4rem;
      }
      p:nth-child(2) {
        position: relative;
        margin: auto;
        width: 2.3rem;
        font-size: 0.16rem;
        opacity: 0.6;
      }
      p:nth-child(2):before,
      p:nth-child(2):after {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        width: 0.55rem;
        height: 1px;
        background-color: #fff;
        content: "";
      }
      p:nth-child(2):before {
        left: -0.5rem;
      }
      p:nth-child(2):after {
        right: -0.5rem;
      }
    }
    form {
      width: 100%;
      height: 4rem;
      margin-top: 0.1rem;
      text-align: center;

      input::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.8);
      }
      input::-moz-placeholder {
        color: rgba(255, 255, 255, 0.8);
      }
      input:-moz-placeholder {
        color: rgba(255, 255, 255, 0.8);
      }
      input:-ms-input-placeholder {
        color: rgba(255, 255, 255, 0.8);
      }

      .inputdiv,
      .code_box,
      button {
        margin-top: 0.6rem;
        font-size: 0.24rem;
      }
      .inputdiv,
      .code_box input {
        display: inline-block;
        position: relative;
        padding-left: 0.6rem;
        width: 5.33rem;
        height: 0.8rem;
        outline: none;
        border: 0.01rem solid #fff;
        border-radius: 0.04rem;
        box-sizing: border-box;
        color: #fff;
        font-size: .24rem;
      }
      .userDiv {
        background: rgba(255, 255, 255, 0.2)
          url("../assets/img/login/icon_user.png") no-repeat 0.2rem 0.25rem/ 0.23rem
          auto;
      }
      .passwordDiv {
        background: rgba(255, 255, 255, 0.2)
          url("../assets/img/login/icon_pw.png") no-repeat 0.2rem 0.25rem/ 0.23rem
          auto;
      }
      .inputdiv input {
        width: 100%;
        height: 100%;
        color: #fff;
        outline: none;
        font-size: 0.24rem;
      }
      .code_box {
        margin-left: auto;
        margin-right: auto;
        width: 5.33rem;
        height: 0.8rem;
        text-align: left;
        input {
          margin: 0 0.3rem 0 0;
          width: 3.2rem;
          background: rgba(255, 255, 255, 0.2)
            url("../assets/img/login/icon_yz.png") no-repeat 0.2rem 0.25rem/ 0.23rem
            auto;
        }
        img {
          display: inline-block;
          width: 1.7rem;
          height: 0.8rem;
          background-color: #fff;
          vertical-align: bottom;
        }
      }
      button {
        width: 5.33rem;
        height: 0.8rem;
        border-radius: 0.04rem;
        background: linear-gradient(left, #4195fb, #2af6f1);
        color: #fff;
        border: 0.01rem solid #fff;
        outline: none;
        cursor: pointer;
      }
    }
  }

  .copyright {
    position: absolute;
    right: 0.6rem;
    bottom: 0.35rem;
    img {
      display: inline-block;
      margin: 0 0.14rem;
      width: 0.23rem;
      vertical-align: middle;
    }
    span {
      font-size: 0.2rem;
      vertical-align: middle;
    }
  }
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
@keyframes slideInRight {
  from {
    transform: translate3d(80%, 0, 0) scale(.8);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0) scale(.8);
  }
}
.slideInRight {
  animation-name: slideInRight;
}
@keyframes slideOutRight {
  from {
    transform: translate3d(0, 0, 0) scale(.8);
  }
  to {
    visibility: hidden;
    transform: translate3d(140%, 0, 0) scale(.8);
  }
}
.slideOutRight {
  animation-name: slideOutRight;
}
</style>