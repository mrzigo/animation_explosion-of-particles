import Explosion from '../dist'

const explosion = new Explosion({
      parentElement: this.$el.find('img'),
      canvasPosition: 'absolute', // default absolute
      zIndex: 1, // default 1000
      left: '200px', // default 0
      top: 0, // default 0
      width: 500, // default 800
      height: 250, // default 400
      total: 1000, // default 1000
      maxLength: 300, // default max(width, height)
      x0: 0, // default 0
      y0: 250, // default height
      direction: -Math.PI / 4 + Math.PI / 20, // default -Math.PI / 4 - Math.PI / 15
      scatter: Math.PI / 8,
      imageUrls: ['particle-1.png',
                  'particle-2.png'], // default [] - none
      minSpeed: 5 // default 1
    })

explosion.start() // Запуск "взрыва"
explosion.pause() // приостановить анимацию
explosion.reverce() // развернуть анимацию (обратный "взрыв")
explosion.clear() // очистить анимацю, установить позициию проигрыша на начало
explosion.setStepAnimation(35) // Установить процент выполнения анимации на 35%
explosion.isStop // true - остановлена анимация / false - анимация в процессе
explosion.isReverceAnimation // true - обратная анимация / false - прямая анимация
