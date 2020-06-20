# levelGaugeXY - _level gauges for x and y indices_
Navigation and visual display of the current and largest values of the array indices \[x, y\]

[demo page](https://slesareva-gala.github.io/)
  
**The reason for the creation**  
Need to visualize tabular data navigation.

**Development goal**  
Visual display of sizes and current index values array \[x, y\] on the minimum number of HTML + CSS elements managed by JS

**Application**  
In a design in which content is formed based on formatted data, for example: json, two-dimensional array, etc.
  
**The essence of the idea**  
![the idea of level gauges](https://github.com/slesareva-gala/levelgaugexy/blob/master/levelgaugexy.png "level gauges for x and y indices")

## 1. Strips for displaying index level gauges  
This is the space between the boundaries of a pair of block elements \<div\>:  
```html 
<div id="base"><div id="work"></div></div>
```
**base**    
    Responsible for the placement on the page and for the style of the strips of the gauges.  
    _CSS style:_  
```css 
#base { 
  position: relative; /* ! static */  
  overflow: hidden;
}
```
**work**
- with a width equal to or less than the width of the base;
- with a length equal to or less than the length of the base;
- coinciding with at least one side with the base;

_CSS style:_
```css 
#work { 
  position: absolute;
}
```
**The dimensions of the working \<div\> and its positioning in the base \<div\> are basis for identification of strips**.

The **X** strip for displaying the **x** level gauge is horizontal the space between the boundaries of the base \<div\> and working \<div\>:
|  |  |
| --- | --- |
| **location:** | top or bottom |
| **positioning:** | horizontally equal to the left shift of the working \<div\> |
| **width:** | equal to the width of the working \<div\> |
| **height:** | equal to the height of the horizontal space between the boundaries of the base and working \<div\>|
| **visualization:** | CSS style of the base \<div\>: **_box-shadow: inset_**.... |

The **Y** strip for displaying the **y** level gauge is vertical the space between the boundaries of the base \<div\> and working \<div\>:
|  |  |
| --- | --- |
| **location:** | left or right |
| **positioning:** | vertically equal to the downward shift of the working \<div\> |
| **width:** | equal to the width of the vertical space between the boundaries of the base \<div\> and working \<div\> |
| **height:** | equal to the height of the worker \<div\> |
| **visualization:** | CSS style of the base \<div\>: **_box-shadow: inset_**.... |

## 2. Index Indicators  
A bar chart built on strips X and Y CSS-style working \<div\>: **_box-shadow_**.

Main characteristics of index level gauges:
|  |  |
| --- | --- |
| **location:** | in the respective strips **X** or **Y** |
| **coordinate origin:** | side of the square of the intersection of strips **X** and **Y** adjacent to the strip |
| **width:** | equal to the width of the corresponding strip |
| **length:** | **calculation:**  |
| |  _for x:_   **x\*w/xMax** |
| |  _for y:_   **y\*h/yMax** |  
| |  **exception:** |
| |  _at x==xMax==0:_ **w** |
| |  _at y==yMax==0:_ **h** |
| |  where: |
| |  **xMax** - the largest value of **x** , _at_ xMax \> 0 |
| |  **yMax** - the largest value of **y** , _at_ yMax \> 0 |
| |  **x** - the current value of x, _at_ 0\<=x\>=xMax-1 |
| |  **y** - the current value of y, _at_ 0\<=y\>=yMax-1 |
| |  **w** - the length of the strip X corresponding to xMax |
| |  **h** - the strip length Y corresponding to yMax |
| **dependence on the index:** | **direct** - when the index increases, the level gauge increases proportionally|  
| |  **inverse** - when the index increases, the level gauge proportionally reduced |
  
***
# IMPLEMENTATION: levelGaugeXY
**Level gauges for x and y indices:** HTML5 + CSS3 + JS (vanilla)

**It has the following advantages:**  
- written in vanilla JavaScript, has no dependencies;
- it has a simple API;
- includes adjusting the size of the strips and level gauges when scaling browser windows by pressing _Ctrl-wheel_ ;
- navigation through indexes with a click of the mouse on the stripes;
- change indices by rotating the mouse wheel over the base \<div\>:  
  - index y - _wheel_ ,  
  - index x – _Shift-wheel_.

## 1. Wiring diagram:
```html 
   <head>
    <!-- .... -->
    <script src="levelgaugexy.min.js"></script> 
   </head>
   <body>
     <!-- .... -->
     <div id="base" >     
        <div id="work" >  
          <script> 'use strict';                    
            levelGaugeXY( 'base','work');
          </script>
          <!-- .... -->
        </div>
     </div>
     <!-- .... -->
   </body>
```
## 2. Function levelGaugeXY()
Function **adds** the **lgxy** property to the base \<div\> **new object of CLASS LevelGaugeXY**.  
> **levelGaugeXY**( **idBase**, **idWork** \[ **{ name: value**, ...}** \] )  
where  
  **idBase**  
    id of the base \<div\>, e.g. \'base\'  
  **idWork**  
    id of the working \<div\>, e.g. \'work\'  
  **{....}**  
    optional installation parameters that change default property values  
      **name: value,**  
      property name and value, e.g. \{ lenY: 5000,\}

## 3. Methods that modify properties directly on the base.lgxy object
### 3.1. Return the current value of the property. Can be modified with assignment operator.

**lenX**  
The quantity values **x**.  
Value is a positive number.  
The default value is set to 0.

**lenY**  
The quantity values **y**.  
Value is a positive number.  
The default value is set to 0.

**x**  
Current value **x**.  
Value between 0 and lenX.  
The default value is set to 0.

**y**  
Current value **y**.  
Value between 0 and lenY.  
The default value is set to 0.

**stepx**  
Step to change **x** value with mouse wheel.  
Value is a positive number.  
The default value is set to 1.

**stepy**  
Step to change **y** value with mouse wheel.  
Value is a positive number.  
The default value is set to 1.

**locationX**  
Strip **X** placement.  
Values: **\'top\'** - at the top, **\'bottom\'** - at the bottom.  
Optional: offset of the working \<div\> in the base \<div\> when \'top\' - to the down, \'bottom\' – to the up.  
The default value is set to \'bottom\'.

**locationY**  
Strip **Y** placement.  
Values: **\'left\'** - at the left, **\'right\'** - at the right.  
Optional: offset of the working \<div\> in the base \<div\> when \'left\' - to the right, \'right\' - to the left.  
The default value is set to \'right\'.

**dependX**  
The dependence of the level gauge **X** on **x** values.  
Values:  
\- **\'inverse\'** - is the inverse relationship to index growth: with increase/decrease **x** level gauge **X** decreases/increases;  
\- **\'directly\'** - consistent with the growth of the index: with increasing/decreasing **x** level gauge **X** increases/decreases.  
The default value is set to \'inverse\'.

**dependY**  
The dependence of the level gauge **Y** on **y** values.  
Values:  
\- **\'inverse\'** - is the inverse relationship to index growth: with increase/decrease **y** level gauge **Y** decreases/increases;  
\- **\'directly\'** - consistent with the growth of the index: with increasing/decreasing **y** level gauge **Y** increases/decreases.  
The default value is set to \'inverse\'.

**colorXY**  
Strips color.  
Values:  
\- **\'none\'** - disable shadows style;  
\- **\'rgb (...)\'** - drawing a shadow with the specified rgb color;  
The default value is set to \'rgb (200,200,200)\'.

**colorlevel**  
Color Level Gauges.  
Value: **\'rgb (...)\'** - drawing a shadow with the specified rgb color.  
The default value is set to \'rgb (100,100,100)\'.

### 3.2. Service methods on the base.lgxy object

**visible()**  
Display changes in strips and level gauges.  
Installed by default.

**hidden()**  
Hide (do not show) strip and level gauge changes.  
It can be used in case of changing a property group.

**resize()**  
Update strips and level gauges according to current base \<div\> sizes and working \<div\>.

**destroy()**  
Disable levelGuageXY.  
Stripes and level gauges are hidden, working \<div\> offsets are canceled, listening for events levelGaugeXY (\'resize\', \'wheel\', \'click\') is disabled, deleted the lgxy property the base \<div\>.

## 4. levelgaugexy event  
It is formed on the base \<div\> when changing the properties x, y, lenX, lenY.  
Flags: **bubbles** set to **true**, **cancelable** set to **false**.

Reading at **evevt.detail**:  
**.base**  
id of base \<div\>;  
**.work**  
id of the working \<div\>  
**.x || .y || .lenX || .lenY**  
the name of the modified property is \'x\' or \'y\' or \'lenX\' or \'lenY\'  
**.value**  
value for changing a property value  
**.old**  
property value before change  
**.new**  
property value after change

## Performance tested on:  
- Google Chrome, Version 83.0.4103.97  
- Firefox Browser, Version 77.0.1  
- Microsoft Edge, Version 83.0.478.45
