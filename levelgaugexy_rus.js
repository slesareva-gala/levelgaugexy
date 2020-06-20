/* levelgaugexy.js  - Index Level Gauges x � y*/

'use strict';

class LevelGaugeXY {    
  constructor( base, work, param ) {
    this.base = base ;
    this.work = work ;

    // ������������� 
    this._init(param);
  }

  // ���������� �������� x
  set lenX( v ) {  
    if ( this._observer('lenX', v, v < 0 ? 0 : v ) ) {
      this.x = this.x;  // �������� x �� ������������:
      if ( this._visible ) this._level();
    }
  }
  get lenX() { return this.list.lenX; } 

  // ���������� �������� y
  set lenY( v ) {  
    if ( this._observer('lenY', v, v < 0 ? 0 : v ) ){
      this.y = this.y;   // �������� y �� ������������:
      if ( this._visible ) this._level();
    }
  }
  get lenY() { return this.list.lenY; } 

  // ���������������: �������� ���������� v ����� 0 � vM
  _range(v,vM) {
    if ( v < 0 ) v = 0 ;
    else if (v > vM) v =  vM < 0  ? 0: vM;
    return v;
  }
 
  // ������� ���������� x
  set x( v ) {
    if ( this._observer('x', v, this._range( v,this.list.lenX-1) )
       && this._visible ) this._level();
  }
  get x() { return this.list.x; } 

  // ������� ���������� y
  set y( v ) {  
    if ( this._observer('y', v, this._range( v,this.list.lenY-1) )
       && this._visible ) this._level();
  }
  get y() { return this.list.y; } 


  // ��� ��������� �������� �������� ��������� ���� 
  set stepx( v ) {
    this.list.stepx = v < 0 ? 0 : v ; 
  }
  get stepx() { return this.list.stepx; } 

  set stepy( v ) {
    this.list.stepy = v < 0 ? 0 : v ; 
  }
  get stepy() { return this.list.stepy; } 


  // ���������� �����
  set locationX( v ) {  
    this.list.locationX = ( v == 'top' ) ?  -1 : 1 ;
    // �������� �������� div � ������� div
    this.work.style.top   = ( this.list.locationX < 0 ? '' : '0px' ) ;
    this.work.style.bottom= ( this.list.locationX < 0 ? '0px' : '' ) ;
    if ( this._visible) {
      this._strip();   // ����� �� ����� �����
      this._level();   // ����� �� ����� �����������
    }
  }
  get locationX() { 
    return ( this.list.locationX > 0 ? 'bottom' : 'top' ) ;
  } 

  set locationY( v ) {  
    this.list.locationY =  ( v == 'left' ) ?  -1 : 1 ;
    // �������� �������� div � ������� div
    this.work.style.left  = ( this.list.locationY < 0 ? '' : '0px' ) ;
    this.work.style.right = ( this.list.locationY < 0 ? '0px' : '' ) ;
    if ( this._visible) {
      this._strip();   // ����� �� ����� �����
      this._level();   // ����� �� ����� �����������
    }
  }
  get locationY() { 
    return ( this.list.locationY > 0 ? 'right' : 'left' ) ;
  } 

  // ����������� ����������� �� �������� x � y
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

  // ���� ����� X�
  set colorXY( v ) {  
    this.list.colorXY = ( v == 'none') ? '': v.replace(/[rgb()]/g,'');
    if ( this._visible) this._strip();  
  }
  get colorXY() { 
    return ( this.list.colorXY ? 'rgb('+this.list.colorXY+')' : 'none') ;
  } 

  // ���� ����������
  set colorLevel( v ) {  
    this.list.colorLevel = v.replace(/[rgb()]/g,''); 
    if ( this._visible) this._level();
  }
  get colorLevel() { 
    return 'rgb('+this.list.colorLevel+')' ;
  } 

  // ���������� (����������) ��������� ����� � �����������
  visible() {
    this._visible = true;

    this._saveOffset();     // ���������� �������� �������� ����
    this._strip();   // ����� �� ����� �����
    this._level();   // ����� �� ����� �����������
  }

  // �������� (�� ����������) ��������� ����� � �����������
  hidden() {
    this._visible = false;
  }
  // ���������� ��������
  resize() { this._resize( this ); }

 
  // ����������� �� ���������� �������� �������
  _observer( name, v, newV ) {

    let oldV = this.list[name];
    this.list[name] = newV;    

    if ( v==oldV && v==newV ) return false;

    let event = new CustomEvent("levelgaugexy", {
      detail: {
        base: this.base.id,        // id �������� div
        work: this.work.id,        // id �������� div
        [name]: { value:v, old:oldV, new:newV },  // ��������� 
      },
      bubbles:    true, // ��������
      cancelable: false  // ���� ���������� preventDefault
    });

    // ������ �������
    this.base.dispatchEvent(event);
    return newV !== oldV; 
  }

  // ���������� �������� �������� �������� ������������� 
  _saveOffset() {
    this.bHeight = this.base.offsetHeight; 
    this.bWidth  = this.base.offsetWidth;
    this.wWidth  = this.work.offsetWidth;
    this.wHeight = this.work.offsetHeight;
    this.widthX  = this.bHeight - this.wHeight ;  
    this.widthY  = this.bWidth  - this.wWidth;
  }

  // ����� �� ����� �����
  _strip() {   
    if ( this.list.colorXY ) {  
      // ���� �� ����� �������� ������
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

  // ����� �� ����� �����������
  _level() {   
    // ����������� ���� �� �������� ������
    let shadowSpread = Math.max( this.widthX, this.widthY) ;  
    // �������� ������� �������� x,� � ������ ����������� �� ��� �����������
    let xL = this.list.dependX ? this.list.x+1 : this.list.lenX-this.list.x-1;
    let yL = this.list.dependY ? this.list.y+1 : this.list.lenY-this.list.y-1 ;

    // ������ �������� ����������
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

  // ���������� �������� (���������� �������)
  _resize( _this ) {
    if ( _this.bWidth  !== _this.base.offsetWidth  ||
         _this.bHeight !== _this.base.offsetHeight ||
         _this.wWidth  !== _this.work.offsetWidth  ||
         _this.wHeight !== _this.work.offsetHeight ) {

      this._saveOffset();     // ���������� �������� �������� �������� ������������� 
      this._strip();   // ����� �� ����� �����
      this._level();   // ����� �� ����� �����������
    }
  }

  // ��������� �������� ��������� ����
  _wheel(e, _this){

    if (e.ctrlKey || e.altKey ) { return; }

    let signOfChange  = e.deltaY > 0 ? 1 : -1 ;
    if (e.shiftKey) { 
      _this.x += signOfChange*_this.stepx;
    } else {
      _this.y += signOfChange*_this.stepy;
    }
    e.preventDefault();   // ������ ��� ������ ��������
  } 

  // ��������� �� ������� �����
  _click(e, _this){

    let mX = e.pageX - pageXOffset;
    let mY = e.pageY - pageYOffset;

    let crBase = _this.base.getBoundingClientRect();
    let crWork = _this.work.getBoundingClientRect();

    // ������ X
    if ( ( ( mY > crBase.top  && mY < crWork.top ) 
        || ( mY > crWork.bottom && mY < crBase.bottom ) )
      && ( mX > crWork.left && mX < crWork.right) ) {
      let x = Math.ceil( (mX-crWork.left)*_this.lenX / crWork.width );
      _this.x = (_this.locationY == 'right' ? 
                 _this.dependX =='inverse' : 
                 _this.dependX =='directly') ? x-1 : _this.lenX - x ;
    }

    // ������ Y
    if ( ( ( mX > crBase.left  && mX < crWork.left ) 
        || ( mX > crWork.right && mX < crBase.right ) )
      && ( mY > crWork.top && mY < crWork.bottom) ) {
      let y = Math.ceil( (mY-crWork.top)*_this.lenY / crWork.height );
      _this.y = (_this.locationX == 'bottom' ? 
                 _this.dependY =='inverse' : 
                 _this.dependY =='directly') ? y-1 : _this.lenY - y ;
    }

  } // END _click()

  // ���������������
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

    // ��������� ������������� �������:
    window.removeEventListener('resize', this._resizeEvent, false );
    this.base.removeEventListener("wheel", this._wheelEvent, {passive:false} );
    this.base.removeEventListener("click", this._clickEvent, false );

    // ��������� �� ������
    if ( this.base.lgxy.__proto__ ) this.base.lgxy.__proto__ = null;
    // ��������� �� div
    delete this.base.lgxy;
  }


  // ������������ 
  _init (param) {      

    // ������� div
    let baseStyle = window.getComputedStyle(this.base);
    if ( baseStyle.position == 'static') 
         this.base.style.position = 'relative';  
    if ( baseStyle.overflow !== 'hidden')
         this.base.style.overflow = 'hidden'; 

    // ������� div
    this.work.style.position = 'absolute';  

    // ������� �������� ������� ( �� ��������� )
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
    // �������� (�� ����������) ��������� ����� � �����������
    this.hidden();

    // ��������������� �������� ������� �� ����������������
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

    // ��������� �������� ��������� ����
    this.base.addEventListener("wheel", this._wheelEvent = function(e){ _this._wheel(e,_this) }, {passive:false} );

    // ��������� �� ������� �����
    this.base.addEventListener("click", this._clickEvent = function(e){ _this._click(e,_this) }, false );

    // ���������� ������ � ����������
    this.visible();
    
  } // END _init()

} // END class LevelGaugeXY

// ����������� ������� ������ LevelGaugeXY � �������� div 
function levelGaugeXY( idBase, idWork, param={} ) {
  let base = document.getElementById( idBase );
  if ( !base ) return;
  let work = document.getElementById( idWork );
  if ( !work ) return;

  base.lgxy = new LevelGaugeXY( base, work, param );
}

