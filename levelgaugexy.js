/* levelgaugexy.js  - Index Level Gauges x and y */

'use strict';

class LevelGaugeXY {    
  constructor( base, work, param ) {
    this.base = base ;
    this.work = work ;

    // initialization
    this._init(param);
  }

  // number of values x
  set lenX( v ) {  
    if ( this._observer('lenX', v, v < 0 ? 0 : v ) ) {
      this.x = this.x;  // checking x for correctness:
      if ( this._visible ) this._level();
    }
  }
  get lenX() { return this.list.lenX; } 

  // number of values y
  set lenY( v ) {  
    if ( this._observer('lenY', v, v < 0 ? 0 : v ) ){
      this.y = this.y;   // checking y for correctness:
      if ( this._visible ) this._level();
    }
  }
  get lenY() { return this.list.lenY; } 

  // auxiliary: v coordinate value between 0 and vM
  _range(v,vM) {
    if ( v < 0 ) v = 0 ;
    else if (v > vM) v =  vM < 0  ? 0: vM;
    return v;
  }
 
  // current coordinate x
  set x( v ) {
    if ( this._observer('x', v, this._range( v,this.list.lenX-1) )
       && this._visible ) this._level();
  }
  get x() { return this.list.x; } 

  // current coordinate y
  set y( v ) {  
    if ( this._observer('y', v, this._range( v,this.list.lenY-1) )
       && this._visible ) this._level();
  }
  get y() { return this.list.y; } 


  // step of changing index values with the mouse whee
  set stepx( v ) {
    this.list.stepx = v < 0 ? 0 : v ; 
  }
  get stepx() { return this.list.stepx; } 

  set stepy( v ) {
    this.list.stepy = v < 0 ? 0 : v ; 
  }
  get stepy() { return this.list.stepy; } 


  // strip placement
  set locationX( v ) {  
    this.list.locationX = ( v == 'top' ) ?  -1 : 1 ;
    // working div offset in the base div
    this.work.style.top   = ( this.list.locationX < 0 ? '' : '0px' ) ;
    this.work.style.bottom= ( this.list.locationX < 0 ? '0px' : '' ) ;
    if ( this._visible) {
      this._strip();   // display of strip
      this._level();   // display of level gauage
    }
  }
  get locationX() { 
    return ( this.list.locationX > 0 ? 'bottom' : 'top' ) ;
  } 

  set locationY( v ) {  
    this.list.locationY =  ( v == 'left' ) ?  -1 : 1 ;
    // working div offset in the base div
    this.work.style.left  = ( this.list.locationY < 0 ? '' : '0px' ) ;
    this.work.style.right = ( this.list.locationY < 0 ? '0px' : '' ) ;
    if ( this._visible) {
      this._strip();   // display of strip
      this._level();   // display of level gauage
    }
  }
  get locationY() { 
    return ( this.list.locationY > 0 ? 'right' : 'left' ) ;
  } 

  // dependence of level gauges on x and y values
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

  // strip color XÓ
  set colorXY( v ) {  
    this.list.colorXY = ( v == 'none') ? '': v.replace(/[rgba()]/g,'');  
    if ( this._visible) this._strip();  
  }
  get colorXY() { 
    return ( this.list.colorXY ? 'rgba('+this.list.colorXY+')' : 'none') ; 
  } 

  // level gauge color
  set colorLevel( v ) {  
    this.list.colorLevel = v.replace(/[rgba()]/g,''); 
    if ( this._visible) this._level();
  }
  get colorLevel() { 
    return 'rgba('+this.list.colorLevel+')' ; 
  } 

  // display of strip changes and level gauges
  visible() {
    this._visible = true;

    this._saveOffset();     // saving div size values

    this._strip();   // display of strip
    this._level();   // display of level gauage
  }

  // hide changes in bands and level gauges
  hidden() {
    this._visible = false;
  }
  // size update
  resize() { this._resize( this ); }

 
  // property change observer
  _observer( name, v, newV ) {

    let oldV = this.list[name];
    this.list[name] = newV;    

    if ( v==oldV && v==newV ) return false;

    let event = new CustomEvent("levelgaugexy", {
      detail: {
        base: this.base.id,        // id of the base div
        work: this.work.id,        // id of the working div
        [name]: { value:v, old:oldV, new:newV },  // changes
      },
      bubbles:    true, 
      cancelable: false  // permission flag of preventDefault
    });

    // start event levelgaugexy
    this.base.dispatchEvent(event);
    return newV !== oldV; 
  }

  // saving div size values
  _saveOffset() {
    this.bHeight = this.base.clientHeight; 
    this.bWidth  = this.base.clientWidth; 
    this.wWidth  = this.work.offsetWidth;
    this.wHeight = this.work.offsetHeight;
    this.widthX  = this.bHeight - this.wHeight ;  
    this.widthY  = this.bWidth  - this.wWidth;
  }

  // display of strip
  _strip() {   
    if ( this.list.colorXY ) {  
      // shadow no more than strip sizes
      let shadowSpread = this.widthX == 0 ? this.widthY :
                         this.widthY == 0 ? this.widthX :
                         Math.min( this.widthX, this.widthY );
      this.base.style.boxShadow = 
           'rgba('+this.list.colorXY+') '+ -this.list.locationY +'px '
                  + -this.list.locationX + 'px 1px , '+
           'rgba('+this.list.colorXY+') '  
                  + this.list.locationY * -0.75 * this.widthY +'px '
                  + this.list.locationX * -0.75 * this.widthX +'px '
                  + shadowSpread+'px inset';  
    }
  }

  // display of level gauage
  _level() {   
    // stretch the shadow to the size of the strip
    let shadowSpread = Math.max( this.widthX, this.widthY) ;  
    // values of current indices x, y taking into account the dependence of level gauges on them
    let xL = this.list.dependX ? this.list.x+1 : this.list.lenX-this.list.x-1;
    let yL = this.list.dependY ? this.list.y+1 : this.list.lenY-this.list.y-1 ;

    // calculation of pointer values
    let levelX = (( !this.list.lenX ) ?  0 :
                 ( xL == this.list.lenX ) ? this.wWidth :
         Math.ceil( xL * this.wWidth / this.list.lenX ) ); 
    let levelY = (( !this.list.lenY ) ?  0 :
                 ( yL == this.list.lenY ) ? this.wHeight :
        Math.ceil( yL * this.wHeight / this.list.lenY ) ); 

    this.work.style.boxShadow = 
        'rgba('+ this.list.colorLevel+') '+ this.list.locationY * 0.5 + 'px ' 
               + this.list.locationX * 0.5 +'px 1px 0px , '+
        'rgba('+ this.list.colorLevel+') '   
               + this.list.locationY * this.wWidth+'px '
               + this.list.locationX * this.wHeight+'px 0px 0px ,'+
        'rgba('+ this.list.colorLevel+') '  
               + this.list.locationY * (shadowSpread + levelX) +'px '
               + this.list.locationX * (shadowSpread + levelY) + 'px 0px '
               + shadowSpread +'px ' ;
  }

  // size update (internal function)
  _resize( _this ) {
    if ( _this.bWidth  !== _this.base.offsetWidth  ||
         _this.bHeight !== _this.base.offsetHeight ||
         _this.wWidth  !== _this.work.offsetWidth  ||
         _this.wHeight !== _this.work.offsetHeight ) {

      this._saveOffset();     // saving div size values
      this._strip();   // display of strip
      this._level();   // display of level gauage
    }
  }

  // mouse wheel index scrolling
  _wheel(e, _this){

    if (e.ctrlKey || e.altKey ) { return; }

    let signOfChange  = e.deltaY > 0 ? 1 : -1 ;
    if (e.shiftKey) { 
      _this.x += signOfChange*_this.stepx;
    } else {
      _this.y += signOfChange*_this.stepy;
    }
    e.preventDefault();   // cancel for browser scroll
  } 

  // mouse click navigation
  _click(e, _this){  

    let mX = Math.round(e.pageX - pageXOffset); 
    let mY = Math.round(e.pageY - pageYOffset); 

    let crWork = {};
    let coords = _this.work.getBoundingClientRect();
    ['top','bottom','left','right','width','height'].forEach( (p) => {
      crWork[p] = Math.round(coords[p]); });
    --crWork.bottom;
    --crWork.right;

    let isXbottom = _this.locationX == 'bottom';   
    let isYright  = _this.locationY == 'right';    
  
    // strip X
    if ( ( isXbottom ? ( mY > crWork.bottom && mY <= (crWork.bottom +_this.widthX) )
                     : ( mY >= (crWork.top-_this.widthX) && mY < crWork.top ) )    
      && ( mX >= crWork.left && mX <= crWork.right ) ) {              

      let x = ( mX == crWork.left ) ? 0 : ( mX == crWork.right) ? _this.lenX :
              Math.ceil( (mX-crWork.left)*_this.lenX / crWork.width );
      _this.x = ( isYright ?                                           
                 _this.dependX =='inverse' : 
                 _this.dependX =='directly') ? x-1 : _this.lenX - x ;
      e.preventDefault(); 
    }

    // strip Y
    if ( ( isYright ? ( mX > crWork.right && mX <= (crWork.right +_this.widthY) )  
                    : ( mX >= (crWork.left-_this.widthY) && mX < crWork.left ) )   
      && ( mY >= crWork.top && mY <= crWork.bottom) ) {             

      let y = ( mY == crWork.top ) ? 0 : ( mY == crWork.bottom) ? _this.lenY :
              Math.ceil( (mY-crWork.top)*_this.lenY / crWork.height );
      _this.y = ( isXbottom ?                                 
                 _this.dependY =='inverse' : 
                 _this.dependY =='directly') ? y-1 : _this.lenY - y ;
      e.preventDefault(); 
    }
  } // END _click()

  // self destruction
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

    // disable event listening:
    window.removeEventListener('resize', this._resizeEvent, false );
    this.base.removeEventListener("wheel", this._wheelEvent, {passive:false} );
    this.base.removeEventListener("mousedown", this._clickEvent, false ); 

    // disconnect from class
    if ( this.base.lgxy.__proto__ ) this.base.lgxy.__proto__ = null;
    // disconnect from the div
    delete this.base.lgxy;
  }


  // initialization
  _init (param) {      

    // base div
    let baseStyle = window.getComputedStyle(this.base);
    if ( baseStyle.position == 'static') 
         this.base.style.position = 'relative';  
    if ( baseStyle.overflow !== 'hidden')
         this.base.style.overflow = 'hidden'; 

    // working div
    this.work.style.position = 'absolute';  

    // current property values (default)
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
      colorXY:'200,200,200,0.9',    
      colorLevel:'100,100,100,0.3', 
    };
    // hide changes in bands and level gauges
    this.hidden();
    this.locationX = 'bottom'; 
    this.locationY = 'right';  

    // overriding property values 
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

    // mouse wheel index scrolling
    this.base.addEventListener("wheel", this._wheelEvent = function(e){ _this._wheel(e,_this) }, {passive:false} );

    // mouse click navigation
    this.base.addEventListener("mousedown", this._clickEvent = function(e){ _this._click(e,_this) }, false ); 

    // display of strips and level gauges
    this.visible();
    
  } // END _init()

} // END class LevelGaugeXY

// connecting an object of class LevelGaugeXY to the base div element
function levelGaugeXY( idBase, idWork, param={} ) { 
   let base, work;

  if ( typeof(idBase) == 'object' ) base = idBase ;
  else base = document.getElementById( idBase );
  if ( !base ) return;

  if ( typeof(idWork) == 'object' ) work = idWork ;
  else work = document.getElementById( idWork );
  if ( !work ) return;

  base.lgxy = new LevelGaugeXY( base, work, param );
}

