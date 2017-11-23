import { fabric as Fabric } from 'fabric'

const Explosion = class {
  constructor(params) {
    this.initialize = this.initialize.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.pause = this.pause.bind(this)
    this.clear = this.clear.bind(this)
    this.imagesLoading = this.imagesLoading.bind(this)
    this.initAnimation = this.initAnimation.bind(this)
    this.reverce = this.reverce.bind(this)
    this.nextPoint = this.nextPoint.bind(this)
    this.createCanvas = this.createCanvas.bind(this)
    this.animation = this.animation.bind(this)
    this.init = this.init.bind(this)
    this.initialize(params)
  }

  initialize(params) {
    this.width = params.width || 800
    this.height = params.height || 400
    this.x0 = params.x0 || 0
    this.y0 = params.y0 || this.height
    this.direction = params.direction || -Math.PI / 4 - Math.PI / 15
    this.scatter = params.scatter || Math.PI / 8
    this.left = params.left
    this.top = params.top
    this.zIndex = params.zIndex || 1000
    this.imageUrls = params.imageUrls || []
    this.parentElement = params.parentElement
    this.canvasPosition = params.canvasPosition || 'absolute'
    this.total = params.total || 1000
    this.blobs = new Array(this.total)
    this.isStop = true
    this.isReverceAnimation = false
    this.countRunning = 0
    this.maxLength = params.maxLength || (this.width > this.height ? this.width : this.height)
    this.minSpeed = params.minSpeed || 1
  }

  init(callback) {
    this.canvasElement = this.createCanvas()
    this.canvas = new Fabric.Canvas(this.canvasElement, {
      renderOnAddRemove: false,
      selection: false
    })
    setTimeout(()=>{
      this.parentElement.append(this.canvasElement)
      this.canvasElement.style.left = this.left || 0
      this.canvasElement.style.top = this.top || 0
      this.canvasElement.style.zIndex = this.zIndex
      if (callback) this.imagesLoading(callback)
    }, 100)
  }

  // Запуск анимации
  start() {
    this.isStop = false
    this.countRunning += 1
    this.isReverceAnimation = false
    if (this.countRunning > 1) return this.animation()
    this.init(this.initAnimation)
  }

  // Развернуть анимацию
  reverce() {
    this.isReverceAnimation = !this.isReverceAnimation
  }

  // остановить анимацию (просто ставим на паузу?)
  stop() {
    this.pause()
    // delete this.blobs ?
  }

  // ставит на паузу
  pause() {
    this.isStop = true
  }

  // Очищает поле
  clear() {
    if (this.countRunning === 0) return false // еще не было запуска
    this.pause()
    this.setStepAnimation(0)
  }

  // Устанавливает процент анимации
  setStepAnimation(procent) {
    if ((procent < 0) || (procent > 100)) {
      return console.error('Процент должен находиться в диапазоне от 0 до 100')
    }
    this.pause()
    this.blobs.forEach((blob) => {
      blob.delta = blob.length * (procent / 100) + (procent > 0 ? blob.speed : 0)
      blob.left = this.x0 + Math.cos(blob.alfa) * blob.delta
      blob.top = this.y0 + Math.sin(blob.alfa) * blob.delta
    })
    this.canvas.renderAll()
    return `Procent animation set in ${procent}%`
  }

  // Загружает массив картинок, после загрузки всех, выполняет келбек
  imagesLoading(callback) {
    let completeLoaded = 0
    let images = []
    const complete = () => {
      completeLoaded+=1
      if (completeLoaded === this.imageUrls.length) callback(images)
    }
    this.imageUrls.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        images.push(img)
        complete()
      }
      img.src = url
    })
  }

  // Загружены картинка, запускаем анимацию
  initAnimation(imgs) {
    const alfa = this.direction
    for (let i = 0; i < this.total; i++) {
      const index = Math.round(Math.random() * this.imageUrls.length)
      const blob = new Fabric.Image(imgs[index], { //img.getElement(), {
        left: 0,
        top: this.height,
        selectable: false
      })
      const da =  Math.pow(this.scatter * Math.random(), 1,45) // Math.pow(Math.random() / 1.7, 1.45)
      blob.alfa = alfa + (da * ( Math.round(Math.random()) * 2 - 1 )) // * Math.round(Math.random())
      blob.length = this.maxLength / 1.2 * Math.random()
      blob.length = blob.length < 5 ? 5 : blob.length
      blob.delta = 0
      blob.speed = blob.length / 15 + 10 * Math.random() + this.minSpeed
      this.canvas.add(blob)
      this.blobs[i] = blob
    }
    this.frames = 0;
    this.startTime = Date.now()
    this.prevTime = this.startTime
    this.isReverceAnimation = false
    this.animation()
  }

  // Рассчет следующих точек
  nextPoint() {
    this.blobs.forEach((blob) => {
      if (this.isReverceAnimation) { // Сворачиваем брызги обратно
        if (blob.delta < -5) return false // не двигать дальше
        blob.delta -= blob.speed
      } else { // прямая анимация
        if (blob.delta > blob.length) return false // не двигать дальше
        blob.delta += blob.speed
      }
      blob.left = this.x0 + Math.cos(blob.alfa) * blob.delta
      blob.top = this.y0 + Math.sin(blob.alfa) * blob.delta
    })
  }

  // Создает канвас для анимации
  createCanvas() {
    const canvas = document.createElement('canvas')
    canvas.style.position = this.canvasPosition
    canvas.width = this.width
    canvas.height = this.height
    return canvas
  }

  // Выполнение анимации
  animation() {
    if (this.isStop) return false
    this.nextPoint()
    Fabric.util.requestAnimFrame(this.animation, this.canvas.getElement())
    this.canvas.renderAll()
  }

}

export default Explosion
