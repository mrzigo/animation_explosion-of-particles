# animation_explosion-of-particles (Анимация взрыва частиц)

![alt text](https://raw.githubusercontent.com/mrzigo/animation_explosion-of-particles/master/example.gif)

## Установка
```
  npm install --save git+https://github.com/mrzigo/live-blob-water.git
```

## Пример использования
```
  import Explosion from '../dist'

  const explosion = new Explosion({
    parentElement: $('img').parent(),       // Элемент в который будет помещен канвас
    canvasPosition: 'absolute',             // default absolute, canvas.style.position
    zIndex: 1,                              // default 1000, canvas.style.zIndex
    left: '200px',                          // default 0, canvas.style.left
    top: 0,                                 // default 0, canvas.style.top
    width: 500,                             // default 800, canvas.width
    height: 250,                            // default 400, canvas.height
    total: 1000,                            // default 1000, количество частиц "взрыва"
    maxLength: 300,                         // default max(width, height), расстояние выброса частиц
    x0: 0,                                  // default 0, позиция X "взрыва"
    y0: 250,                                // default height, позиция Y "взрыва"
    direction: -Math.PI / 4 + Math.PI / 20, // default -Math.PI / 4 - Math.PI / 15, наклон направления "взрыва"
    scatter: Math.PI / 8,                   // default Math.PI / 8, расброс частиц относительно наклона направления
    imageUrls: ['particle-1.png',
                'particle-2.png'],          // default [] - none, картинки частиц, может быть сколько угодно, выбираются рандомно
    minSpeed: 5                             // default 1, минимальная скорость частиц
  })
```

## Интерфейс объекта
```
  explosion.start()               // Запуск "взрыва"
  explosion.pause()               // приостановить анимацию
  explosion.reverce()             // развернуть анимацию (обратный "взрыв")
  explosion.clear()               // очистить анимацю, установить позициию проигрыша на начало
  explosion.setStepAnimation(35)  // Установить процент выполнения анимации на 35%
  explosion.isStop                // true - остановлена анимация / false - анимация в процессе
  explosion.isReverceAnimation    // true - обратная анимация / false - прямая анимация
```

## Возможности
```
  1. направленный взрыв
  2. взрыв в разные стороны
  3. эмуляция спрея балончика
  4. контроль разброса, вплодь до 2 * Math.PI
```

## Недостатки
```
  1. Ручное позиционирование canvas области
```
