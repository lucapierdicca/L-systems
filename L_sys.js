function derive(L_sys, currWord){
	nextWord = '';
	for(let char of currWord){
		if(char in L_sys['P'])
			nextWord += L_sys['P'][char]; 
		else
			nextWord += char;
	}
	return nextWord;
}

function derivePar(L_sys, currWord){
	let nextWord = [];
	let not_in;
	
	for(let module of currWord){
		not_in = true;
		for(production of L_sys['P']){
			if(module['sym'] == production['pred']){
				not_in = false;
				if(production['cond'](module)){
					for(let succ of production['succ'](module)){
						nextWord.push(succ);
					}
				}	    
			}
		}
		
		if(not_in){
			nextWord.push(module);
		}
	}

	return nextWord;
}

function interpret(q, delta, d, currWord){
	let stack = [];
	let linesPoints = [];
	
	for(let char of currWord){
		switch (char){
			case 'F':
				linesPoints.push([[q[0],q[1],0]])
				
				q = [q[0]+d*Math.cos(q[2]),
					 q[1]+d*Math.sin(q[2]),
					 q[2]];
				
                linesPoints[linesPoints.length-1].push([q[0],q[1],0]);
				break;
			case '+':
				q = [q[0],q[1],q[2]+delta];
				break;
			case '-':
				q = [q[0],q[1],q[2]-delta];
				break;
		    case '[':
		        stack.unshift(q);
		        break;
		    case ']':
		        q = stack.shift(q);
		        break;
		    case 'f':
		        q = [q[0]+d*Math.cos(q[2]),
					 q[1]+d*Math.sin(q[2]),
					 q[2]];
		        break;
			default:
					    
		}

												 
    }

    return linesPoints;
    
}

function interpretPar(q, currWord){
	let stack = [];
	let linesData = [];
	let circleData = [];
	let d,t,delta,radius,color;

	for(let modl of currWord){
		
		switch (modl['sym']){
			case 'FI':
				d = modl['par'][1];
				t = modl['par'][0]; //thickness

				linesData.push([[q[0],q[1],0]])
				
				q = [q[0]+d*Math.cos(q[2]),
					 q[1]+d*Math.sin(q[2]),
					 q[2]];
				
                linesData[linesData.length-1].push([q[0],q[1],0]);
                linesData[linesData.length-1].push(t);
				break;
			case 'FL':
				d = modl['par'][1];
				t = modl['par'][0]; //thickness

				linesData.push([[q[0],q[1],0]])
				
				q = [q[0]+d*Math.cos(q[2]),
					 q[1]+d*Math.sin(q[2]),
					 q[2]];
				
                linesData[linesData.length-1].push([q[0],q[1],0]);
                linesData[linesData.length-1].push(t);
				break;
			case '+':
				delta = modl['par'][0];
				q = [q[0],q[1],q[2]+delta];
				break;
			case '-':
				delta = modl['par'][0];
				q = [q[0],q[1],q[2]-delta];
				break;
			case '[':
				stack.unshift(q);
				break;
			case ']':
				q = stack.shift()
				break;
			case 'K':
				radius = modl['par'][0];
				color = modl['par'][2];
				circleData = [[q[0], q[1]], radius, color];
			break;
		}
	}

	return [linesData, circleData];
}


// let material = new THREE.LineBasicMaterial({
//   color: 0xff0000
// });


// for(let linePoints of linesPoints){
//   let geometry = new THREE.Geometry;
//   for(let point of linePoints){
//     geometry.vertices.push(new THREE.Vector3(point[0],point[1],point[2]));
//   }
//   let line = new THREE.Line(geometry, material);
//   scene.add(line);
// }








