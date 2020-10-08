// scene
let scene = new THREE.Scene();

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.setClearColor("rgb(125,110,90)");
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight; // the canvas default
const near = 0.5;
const far = 300;
let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//let camera = new THREE.OrthographicCamera(  -10, 10, 5, -5, 0.5, 300 );
camera.position.set(0, 0, 200);
//camera.zoom = 1
camera.updateProjectionMatrix();



// L-system
let n,d,delta;
let q = [];
let word = '';

let G = {
	'V':['F','+','-'],
	'w':'F+F+F+F',
	'P':{'F':'FF+F+F+F+F+F-F'}
};

let S = {
	'V':['L','+','-','R'],
	'w':'R',
	'P':{'L':'R+L+R',
	     'R':'L-R-L'}
};

let B = {
	'V':['X','F','-','+','[',']'],
	'w':'X',
	'P':{'X':'F-[[X]+X]+F[+FX]-X',
	     'F':'FF'}
};

let M = {
	'V':['X','F','-','+','[',']'],
	'w':'FX',
	'P':{'X':'[+FX][F][-F]'}
};

let Cleaver = {
	'V':['X','F','-','+','[',']'],
	'w':'ILAK',
	'P':{'A':'ILA',
	     'I':'F',
	     'L':'[+F][-F]',
	     'K':'FF[+++F]---F+++FF'}
};

let BookPar = {
	'V':{'A':2,'B':1,'C':0},
	'w':[{'sym':'B', 'par':[2]},{'sym':'A', 'par':[4,4]}],
	'P':[{'pred':'A',
		  'cond':(module) => {return module['par'][1] <= 3}, 
	      'succ':(module) => {return [{'sym':'A','par':[module['par'][0]*2, module['par'][0]+module['par'][1]]}]}},
	     {'pred':'A',
	      'cond':(module) => {return module['par'][1] > 3},
	      'succ':(module) => {return [{'sym':'B','par':[module['par'][0]]},{'sym':'A','par':[module['par'][0]/module['par'][1],0]}]}},
	     {'pred':'B',
	      'cond':(module) => {return module['par'][0] < 1}, 
	      'succ':(module) => {return [{'sym':'C','par':[]}]}},
	     {'pred':'B',
	      'cond':(module) => {return module['par'][0] >= 1}, 
	      'succ':(module) => {return [{'sym':'B','par':[module['par'][0]-1]}]}}]
};

let i = 0;
let Iw = [4,0.9];
let Lw = [3,0.5,30*Math.PI/180];
let c = 0.9;
let Aw = [Iw.map(x => c*x), Lw.map(x => c*x), i].flat(1);
Aw[4] *= c;
let Kw = [0.25,i,[0.1,0.37,0.1]];
                          

let CleaverPar = {
	'V':['I','L','A','K','FI','FL','[',']', '+','-'],
	'w':[{'sym':'I', 'par':Iw},
	     {'sym':'L', 'par':Lw},
	     {'sym':'A', 'par':Aw},
	     {'sym':'K', 'par':Kw}],
	'P':[{'pred':'I',
		  'cond':(module) => {return true}, 
	      'succ':(module) => {return [{'sym':'FI','par':[module['par'][0],module['par'][1]]}]}},
	     {'pred':'FI',
	      'cond':(module) => {return true},
	      'succ':(module) => {return [{'sym':'FI','par':[1.1*module['par'][0],1.1*module['par'][1]]}]}},
	     {'pred':'L',
	      'cond':(module) => {return true}, 
	      'succ':(module) => {return [{'sym':'[','par':[]},
                                    {'sym':'+','par':[module['par'][2]]},
	                                  {'sym':'FL','par':[module['par'][0],module['par'][1]]},
	                                  {'sym':']','par':[]},
	                                  {'sym':'[','par':[]},
                                    {'sym':'-','par':[module['par'][2]]},
	                                  {'sym':'FL','par':[module['par'][0],module['par'][1]]},
	                                  {'sym':']','par':[]}]}},
  	   {'pred':'+',
  		  'cond':(module) => {return module['par'][0] <= Math.PI/2.2}, 
  		  'succ':(module) => {return [{'sym':'+','par':[1.1*module['par'][0]]}]}},
       {'pred':'+',
        'cond':(module) => {return module['par'][0] > Math.PI/2.2}, 
        'succ':(module) => {return [{'sym':'+','par':[module['par'][0]]}]}},
  	   {'pred':'-',
  		  'cond':(module) => {return module['par'][0] <= Math.PI/2.2}, 
  		  'succ':(module) => {return [{'sym':'-','par':[1.1*module['par'][0]]}]}},
       {'pred':'-',
        'cond':(module) => {return module['par'][0] > Math.PI/2.2}, 
        'succ':(module) => {return [{'sym':'-','par':[module['par'][0]]}]}},
	     {'pred':'FL',
	      'cond':(module) => {return true}, 
	      'succ':(module) => {return [{'sym':'FL','par':[1.09*module['par'][0],1.1*module['par'][1]]}]}},
	     {'pred':'A',
		    'cond':(module) => { return ([2,3,5,8].includes(module['par'][5]))}, 
	      'succ':(module) => {return [{'sym':'I','par':[module['par'][0], module['par'][1]]},
                                    {'sym':'L','par':[module['par'][2], module['par'][3], module['par'][4]]},
                                    {'sym':'A','par':[c*module['par'][0], c*module['par'][1], c*module['par'][2], c*module['par'][3], module['par'][4], module['par'][5]+1]}]}},
       {'pred':'A',
        'cond':(module) => { return !([2,3,5,8].includes(module['par'][5]))}, 
        'succ':(module) => {return [{'sym':'A','par':[module['par'][0], module['par'][1], module['par'][2], module['par'][3], module['par'][4], module['par'][5]+1]}]}},
	     {'pred':'K',
	      'cond':(module) => {return module['par'][1] <= 10},
	      'succ':(module) => {return [{'sym':'K', 'par':[0.95*module['par'][0], module['par'][1]+1, module['par'][2]]}]}},
       {'pred':'K',
        'cond':(module) => {return module['par'][1] > 10},
        'succ':(module) => {return [{'sym':'K', 'par':[module['par'][0], module['par'][1]+1, module['par'][2].map(x => 1.5*x)]}]}}]
};



// ---------------------------NON-PARAMETRIC-------------------------
// ------------------------------------------------------------------

word 	= B['w'];
n       = 5;

q 		= [0,0,Math.PI/2];
d 		= 1;
delta	= Math.PI/6;

for(let i=0;i<n;i++)
  word = derive(B, word);



// q 		= [0,0,0];
// d 		= 1;
// delta	= Math.PI/2;

//word='FF+FFF+FFF+FF+F+-ff+FF+FFF+FF+F+-ff+FF+FFF+FF+F+-ff+'


linesPoints = interpret(q, delta, d, word);


let lineMaterial = new MeshLineMaterial( {
  useMap: 0,
  useAlphaMap: 0,
  color: new THREE.Color().setRGB(0.6,0.8,1),
  lineWidth:1,
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  sizeAttenuation: 0,
});


linesGroup = []
for(let linePoints of linesPoints){
	let line = new MeshLine();
    let lineGeometry = new THREE.Geometry();
	for(let point of linePoints){
        lineGeometry.vertices.push(new THREE.Vector3(point[0],point[1],point[2]))
	}
	line.setGeometry(lineGeometry);

	linesGroup.push(new THREE.Mesh( line.geometry, lineMaterial )); 
}

for(let i of linesGroup)
	scene.add(i);


//----------------------------PARAMETRIC-----------------------------------
// ------------------------------------------------------------------------

// word  = CleaverPar['w'];
// n       = 1;

// q     = [0,-8,Math.PI/2];


// for(i;i<n;i++)
//   word = derivePar(CleaverPar, word);

// console.log(word);

// let data = interpretPar(q, word);
// console.log(data)

// // lines
// let linesGroup = []

// for(let lineData of data[0]){
//   let start, end, thickness;
//   start = lineData[0];
//   end = lineData[1];
//   thickness = lineData[2];

//   let line = new MeshLine();
//   let lineMaterial = new MeshLineMaterial( {
//     useMap: 0,
//     useAlphaMap: 0,
//     color: new THREE.Color().setRGB(0.6,0.8,0.3),
//     lineWidth:thickness,
//     resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
//     sizeAttenuation: 0
//   }); 

//   let lineGeometry = new THREE.Geometry();
  
//   lineGeometry.vertices.push(new THREE.Vector3(start[0],start[1],start[2]));
//   lineGeometry.vertices.push(new THREE.Vector3(end[0],end[1],end[2]));

//   line.setGeometry(lineGeometry);
//   linesGroup.push(new THREE.Mesh(line.geometry, lineMaterial)); 

// }

// for(let i of linesGroup)
//  scene.add(i);





renderer.render(scene, camera);


