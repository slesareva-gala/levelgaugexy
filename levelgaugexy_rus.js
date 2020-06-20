/* levelgaugexy.js  - Index Level Gauges x и y*/

'use strict';

class LevelGaugeXY {    
  constructor( base, work, param ) {
    this.base = base ;
    this.work = work ;

    // инициализация 
    this._init(param);
  }

  // количество значений x
  set lenX( v ) {  
    if ( this._observer('lenX', v, v < 0 ? 0 : v ) ) {
      this.x = this.x;  // проверка x на корректрость:
      if ( this._visible ) this._level();
    }
  }
  get lenX() { return this.list.lenX; } 

  // количество значений y
  set lenY( v ) {  
    if ( this._observer('lenY', v, v < 0 ? 0 : v ) ){
      this.y = this.y;   // проверка y на корректрость:
      if ( this._visible ) this._level();
    }
  }
  get lenY() { return this.list.lenY; } 

  // вспомогательная: значение координаты v между 0 и vM
  _range(v,vM) {
    if ( v < 0 ) v = 0 ;
    else if (v > vM) v =  vM < 0  ? 0: vM;
    return v;
  }
 
  // текущая координата x
  set x( v ) {
    if ( this._observer('x', v, this._range( v,this.list.lenX-1) )
       && this._visible ) this._level();
  }
  get x() { return this.list.x; } 

  // текущая координата y
  set y( v ) {  
    if ( this._observer('y', v, this._range( v,this.list.lenY-1) )
       && this._visible ) this._level();
  }
  get y() { return this.list.y; } 


  // шаг изменения значений индексов колесиком мыши 
  set stepx( v ) {
    this.list.stepx = v < 0 ? 0 : v ; 
  }
  get stepx() { return this.list.stepx; } 

  set stepy( v ) {
    this.list.stepy = v < 0 ? 0 : v ; 
  }
  get stepy() { return this.list.stepy; } 


  // размещение полос
  set locationX( v ) {  
    this.list.locationX = ( v == 'top' ) ?  -1 : 1 ;
    // смещение рабочего div в базовом div
    this.work.style.top   = ( this.list.locationX < 0 ? '' : '0px' ) ;
    this.work.style.bottom= ( this.list.locationX < 0 ? '0px' : '' ) ;
    if ( this._visible) {
      this._strip();   // вывод на экран полос
      this._level();   // вывод на экран уровнемеров
    }
  }
  get locationX() { 
    return ( this.list.locationX > 0 ? 'bottom' : 'top' ) ;
  } 

  set locationY( v ) {  
    this.list.locationY =  ( v == 'left' ) ?  -1 : 1 ;
    // смещение рабочего div в базовом div
    this.work.style.left  = ( this.list.locationY < 0 ? '' : '0px' ) ;
    this.work.style.right = ( this.list.locationY < 0 ? '0px' : '' ) ;
    if ( this._visible) {
      this._strip();   // вывод на экран полос
      this._level();   // вывод на экран уровнемеров
    }
  }
  get locationY() { 
    return ( this.list.locationY > 0 ? 'right' : 'left' ) ;
  } 

  // зависимость уровнемеров от значений x и y
  set dependX( v ) {  
    this.list.dependX = ( v == 'inverse' ) ?  1 : 0 ;
    if ( this._visible) this._level();
  }
  get dependX() { 
    return ( this.list.dependX ? 'inverse' : 'directly' ) ;
  } 

  set dependY( v ) {  
    this.list.dependY = ( v == 'inverse' ) ?  1 : 0 ;
    if ( this._visible) this._level();
  }
  get dependY() { 
    return ( this.list.dependY ? 'inverse' : 'directly' ) ;
  } 

  // цвет полос XУ
  set colorXY( v ) {  
    this.list.colorXY = ( v == 'none') ? '': v.replace(/[rgb()]/g,'');
    if ( this._visible) this._strip();  
  }
  get colorXY() { 
    return ( this.list.colorXY ? 'rgb('+this.list.colorXY+')' : 'none') ;
  } 

  // цвет уровнемера
  set colorLevel( v ) {  
    this.list.colorLevel = v.replace(/[rgb()]/g,''); 
    if ( this._visible) this._level();
  }
  get colorLevel() { 
    return 'rgb('+this.list.colorLevel+')' ;
  } 

  // отобразить (отображать) изменения полос и уровнемеров
  visible() {
    this._visible = true;

    this._saveOffset();     // сохранение значений размеров окон
    this._strip();   // вывод на экран полос
    this._level();   // вывод на экран уровнемеров
  }

  // скрывать (не отображать) изменения полос и уровнемеров
  hidden() {
    this._visible = false;
  }
  // обновление размеров
  resize() { this._resize( this ); }

 
  // наблюдатель за изменением значений свойств
  _observer( name, v, newV ) {

    let oldV = this.list[name];
    this.list[name] = newV;    

    if ( v==oldV && v==newV ) return false;

    let event = new CustomEvent("levelgaugexy", {
      detail: {
        base: this.base.id,        // id базового div
        work: this.work.id,        // id рабочего div
        [name]: { value:v, old:oldV, new:newV },  // изменения 
      },
      bubbles:    true, // всплытие
      cancelable: false  // флаг разрешения preventDefault
    });

    // запуск события
    this.base.dispatchEvent(event);
    return newV !== oldV; 
  }

  // сохранение значений размеров текущего представления 
  _saveOffset() {
    this.bHeight = this.base.offsetHeight; 
    this.bWidth  = this.base.offsetWidth;
    this.wWidth  = this.work.offsetWidth;
    this.wHeight = this.work.offsetHeight;
    this.widthX  = this.bHeight - this.wHeight ;  
    this.widthY  = this.bWidth  - this.wWidth;
  }

  // вывод на экран полос
  _strip() {   
    if ( this.list.colorXY ) {  
      // тень не более размеров полосы
      let shadowSpread = this.widthX == 0 ? this.widthY :
                         this.widthY == 0 ? this.widthX :
                         Math.min( this.widthX, this.widthY );
      this.base.style.boxShadow = 
           'rgba('+this.list.colorXY+', 0.9) '+ -this.list.locationY +'px '
                  + -this.list.locationX + 'px 1px , '+
           'rgba('+this.list.colorXY+', 0.9) '
                  + this.list.locationY * -0.75 * this.widthY +'px '
                  + this.list.locationX * -0.75 * this.widthX +'px '
                  + shadowSpread+'px inset';  
    }
  }

  // вывод на экран уровнемеров
  _level() {   
    // растягиваем тень до размеров полосы
    let shadowSpread = Math.max( this.widthX, this.widthY) ;  
    // значения текущих индексов x,у с учетом зависимости от них уровнемеров
    let xL = this.list.dependX ? this.list.x+1 : this.list.lenX-this.list.x-1;
    let yL = this.list.dependY ? this.list.y+1 : this.list.lenY-this.list.y-1 ;

    // расчет значений указателей
    let levelX = (( !this.list.lenX ) ?  0 :
                 ( xL == this.list.lenX ) ? this.wWidth :
         Math.ceil( xL * this.wWidth / this.list.lenX ) ); 
    let levelY = (( !this.list.lenY ) ?  0 :
                 ( yL == this.list.lenY ) ? this.wHeight :
        Math.ceil( yL * this.wHeight / this.list.lenY ) ); 

    this.work.style.boxShadow = 
        'rgba('+ this.list.colorLevel+', 0.3) '+ this.list.locationY * 0.5 + 'px '
               + this.list.locationX * 0.5 +'px 1px 0px , '+
        'rgba('+ this.list.colorLevel+', 0.3) '
               + this.list.locationY * this.wWidth+'px '
               + this.list.locationX * this.wHeight+'px 0px 0px ,'+
        'rgba('+ this.list.colorLevel+', 0.3) '
               + this.list.locationY * (shadowSpread + levelX) +'px '
               + this.list.locationX * (shadowSpread + levelY) + 'px 0px '
               + shadowSpread +'px ' ;
  }

  // обновление размеров (внутренняя функция)
  _resize( _this ) {
    if ( _this.bWidth  !== _this.base.offsetWidth  ||
         _this.bHeight !== _this.base.offsetHeight ||
         _this.wWidth  !== _this.work.offsetWidth  ||
         _this.wHeight !== _this.work.offsetHeight ) {

      this._saveOffset();     // сохранение значений размеров текущего представления 
      this._strip();   // вывод на экран полос
      this._level();   // вывод на экран уровнемеров
    }
  }

  // прокрутка индексов колесиком мыши
  _wheel(e, _this){

    if (e.ctrlKey || e.altKey ) { return; }

    let signOfChange  = e.deltaY > 0 ? 1 : -1 ;
    if (e.shiftKey) { 
      _this.x += signOfChange*_this.stepx;
    } else {
      _this.y += signOfChange*_this.stepy;
    }
    e.preventDefault();   // отмена для скрола браузера
  } 

  // навигация по нажатию мышки
  _click(e, _this){

    let mX = e.pageX - pageXOffset;
    let mY = e.pageY - pageYOffset;

    let crBase = _this.base.getBoundingClientRect();
    let crWork = _this.work.getBoundingClientRect();

    // полоса X
    if ( ( ( mY > crBase.top  && mY < crWork.top ) 
        || ( mY > crWork.bottom && mY < crBase.bottom ) )
      && ( mX > crWork.left && mX < crWork.right) ) {
      let x = Math.ceil( (mX-crWork.left)*_this.lenX / crWork.width );
      _this.x = (_this.locationY == 'right' ? 
                 _this.dependX =='inverse' : 
                 _this.dependX =='directly') ? x-1 : _this.lenX - x ;
    }

    // полоса Y
    if ( ( ( mX > crBase.left  && mX < crWork.left ) 
        || ( mX > crWork.right && mX < crBase.right ) )
      && ( mY > crWork.top && mY < crWork.bottom) ) {
      let y = Math.ceil( (mY-crWork.top)*_this.lenY / crWork.height );
      _this.y = (_this.locationX == 'bottom' ? 
                 _this.dependY =='inverse' : 
                 _this.dependY =='directly') ? y-1 : _this.lenY - y ;
    }

  } // END _click()

  // самоуничтожение
  destroy() {
    this.base.style.position = '';  
    this.base.style.overflow = ''; 
    this.base.style.boxShadow = '';
    this.work.style.position = '';  
    this.work.style.boxShadow = '';
    this.work.style.top   = '' ;
    this.work.style.bottom= '' ;
    this.work.style.left  = '' ;
    this.work.style.right = '' ;

    // отключаем прослушивание событий:
    window.removeEventListener('resize', this._resizeEvent, false );
    this.base.removeEventListener("wheel", this._wheelEvent, {passive:false} );
    this.base.removeEventListener("click", this._clickEvent, false );

    // отключаем от класса
    if ( this.base.lgxy.__proto__ ) this.base.lgxy.__proto__ = null;
    // отключаем от div
    delete this.base.lgxy;
  }


  // иницализация 
  _init (param) {      

    // базовый div
    let baseStyle = window.getComputedStyle(this.base);
    if ( baseStyle.position == 'static') 
         this.base.style.position = 'relative';  
    if ( baseStyle.overflow !== 'hidden')
         this.base.style.overflow = 'hidden'; 

    // рабочий div
    this.work.style.position = 'absolute';  

    // текущие значения свойств ( по умолчанию )
    this.list = {
      lenX:0, 
      lenY:0,
      x:0,
      y:0,
      stepx: 1, 
      stepy: 1,
      dependX: 1,   
      dependY: 1,   
      locationX: 1,
      locationY: 1,
      colorXY:'200,200,200',
      colorLevel:'100,100,100',
    };
    // скрывать (не отображать) изменения полос и уровнемеров
    this.hidden();

    // переопределение значений свойств на пользовательские
    for ( let key in param ) {
      if ( key in this.list ) {
        if ( ['lenX','lenY','x','y','stepx','stepy'].includes(key) ) {
          if ( +param[key] ) this[key] = +param[key];
        } else if (typeof(param[key]) == 'string' ) {
          this[key] = param[key].split(' ').join('');
        }
      }
    }

    let _this = this;
    window.addEventListener('resize', this._resizeEvent = function(){ _this._resize(_this) }, false );

    // прокрутка индексов колесиком мыши
    this.base.addEventListener("wheel", this._wheelEvent = function(e){ _this._wheel(e,_this) }, {passive:false} );

    // навигация по нажатию мышки
    this.base.addEventListener("click", this._clickEvent = function(e){ _this._click(e,_this) }, false );

    // отобразить полосы и уровнемеры
    this.visible();
    
  } // END _init()

} // END class LevelGaugeXY

// подключение объекта класса LevelGaugeXY к базовому div 
function levelGaugeXY( idBase, idWork, param={} ) {
  let base = document.getElementById( idBase );
  if ( !base ) return;
  let work = document.getElementById( idWork );
  if ( !work ) return;

  base.lgxy = new LevelGaugeXY( base, work, param );
}

