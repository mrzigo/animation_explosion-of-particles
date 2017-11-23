'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fabric = require('fabric');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Explosion = function () {
  function Explosion(params) {
    _classCallCheck(this, Explosion);

    this.initialize = this.initialize.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.pause = this.pause.bind(this);
    this.clear = this.clear.bind(this);
    this.imagesLoading = this.imagesLoading.bind(this);
    this.initAnimation = this.initAnimation.bind(this);
    this.reverce = this.reverce.bind(this);
    this.nextPoint = this.nextPoint.bind(this);
    this.createCanvas = this.createCanvas.bind(this);
    this.animation = this.animation.bind(this);
    this.init = this.init.bind(this);
    this.initialize(params);
  }

  _createClass(Explosion, [{
    key: 'initialize',
    value: function initialize(params) {
      this.width = params.width || 800;
      this.height = params.height || 400;
      this.x0 = params.x0 || 0;
      this.y0 = params.y0 || this.height;
      this.direction = params.direction || -Math.PI / 4 - Math.PI / 15;
      this.scatter = params.scatter || Math.PI / 8;
      this.left = params.left;
      this.top = params.top;
      this.zIndex = params.zIndex || 1000;
      this.imageUrls = params.imageUrls || [];
      this.parentElement = params.parentElement;
      this.canvasPosition = params.canvasPosition || 'absolute';
      this.total = params.total || 1000;
      this.blobs = new Array(this.total);
      this.isStop = true;
      this.isReverceAnimation = false;
      this.countRunning = 0;
      this.maxLength = params.maxLength || (this.width > this.height ? this.width : this.height);
      this.minSpeed = params.minSpeed || 1;
    }
  }, {
    key: 'init',
    value: function init(callback) {
      var _this = this;

      this.canvasElement = this.createCanvas();
      this.canvas = new _fabric.fabric.Canvas(this.canvasElement, {
        renderOnAddRemove: false,
        selection: false
      });
      setTimeout(function () {
        _this.parentElement.append(_this.canvasElement);
        _this.canvasElement.style.left = _this.left || 0;
        _this.canvasElement.style.top = _this.top || 0;
        _this.canvasElement.style.zIndex = _this.zIndex;
        if (callback) _this.imagesLoading(callback);
      }, 100);
    }

    // Запуск анимации

  }, {
    key: 'start',
    value: function start() {
      this.isStop = false;
      this.countRunning += 1;
      this.isReverceAnimation = false;
      if (this.countRunning > 1) return this.animation();
      this.init(this.initAnimation);
    }

    // Развернуть анимацию

  }, {
    key: 'reverce',
    value: function reverce() {
      this.isReverceAnimation = !this.isReverceAnimation;
    }

    // остановить анимацию (просто ставим на паузу?)

  }, {
    key: 'stop',
    value: function stop() {
      this.pause();
      // delete this.blobs ?
    }

    // ставит на паузу

  }, {
    key: 'pause',
    value: function pause() {
      this.isStop = true;
    }

    // Очищает поле

  }, {
    key: 'clear',
    value: function clear() {
      if (this.countRunning === 0) return false; // еще не было запуска
      this.pause();
      this.setStepAnimation(0);
    }

    // Устанавливает процент анимации

  }, {
    key: 'setStepAnimation',
    value: function setStepAnimation(procent) {
      var _this2 = this;

      if (procent < 0 || procent > 100) {
        return console.error('Процент должен находиться в диапазоне от 0 до 100');
      }
      this.pause();
      this.blobs.forEach(function (blob) {
        blob.delta = blob.length * (procent / 100) + (procent > 0 ? blob.speed : 0);
        blob.left = _this2.x0 + Math.cos(blob.alfa) * blob.delta;
        blob.top = _this2.y0 + Math.sin(blob.alfa) * blob.delta;
      });
      this.canvas.renderAll();
      return 'Procent animation set in ' + procent + '%';
    }

    // Загружает массив картинок, после загрузки всех, выполняет келбек

  }, {
    key: 'imagesLoading',
    value: function imagesLoading(callback) {
      var _this3 = this;

      var completeLoaded = 0;
      var images = [];
      var complete = function complete() {
        completeLoaded += 1;
        if (completeLoaded === _this3.imageUrls.length) callback(images);
      };
      this.imageUrls.forEach(function (url) {
        var img = new Image();
        img.onload = function () {
          images.push(img);
          complete();
        };
        img.src = url;
      });
    }

    // Загружены картинка, запускаем анимацию

  }, {
    key: 'initAnimation',
    value: function initAnimation(imgs) {
      var alfa = this.direction;
      for (var i = 0; i < this.total; i++) {
        var index = Math.round(Math.random() * this.imageUrls.length);
        var blob = new _fabric.fabric.Image(imgs[index], { //img.getElement(), {
          left: 0,
          top: this.height,
          selectable: false
        });
        var da = Math.pow(this.scatter * Math.random(), 1, 45); // Math.pow(Math.random() / 1.7, 1.45)
        blob.alfa = alfa + da * (Math.round(Math.random()) * 2 - 1); // * Math.round(Math.random())
        blob.length = this.maxLength / 1.2 * Math.random();
        blob.length = blob.length < 5 ? 5 : blob.length;
        blob.delta = 0;
        blob.speed = blob.length / 15 + 10 * Math.random() + this.minSpeed;
        this.canvas.add(blob);
        this.blobs[i] = blob;
      }
      this.frames = 0;
      this.startTime = Date.now();
      this.prevTime = this.startTime;
      this.isReverceAnimation = false;
      this.animation();
    }

    // Рассчет следующих точек

  }, {
    key: 'nextPoint',
    value: function nextPoint() {
      var _this4 = this;

      this.blobs.forEach(function (blob) {
        if (_this4.isReverceAnimation) {
          // Сворачиваем брызги обратно
          if (blob.delta < -5) return false; // не двигать дальше
          blob.delta -= blob.speed;
        } else {
          // прямая анимация
          if (blob.delta > blob.length) return false; // не двигать дальше
          blob.delta += blob.speed;
        }
        blob.left = _this4.x0 + Math.cos(blob.alfa) * blob.delta;
        blob.top = _this4.y0 + Math.sin(blob.alfa) * blob.delta;
      });
    }

    // Создает канвас для анимации

  }, {
    key: 'createCanvas',
    value: function createCanvas() {
      var canvas = document.createElement('canvas');
      canvas.style.position = this.canvasPosition;
      canvas.width = this.width;
      canvas.height = this.height;
      return canvas;
    }

    // Выполнение анимации

  }, {
    key: 'animation',
    value: function animation() {
      if (this.isStop) return false;
      this.nextPoint();
      _fabric.fabric.util.requestAnimFrame(this.animation, this.canvas.getElement());
      this.canvas.renderAll();
    }
  }]);

  return Explosion;
}();

exports.default = Explosion;
