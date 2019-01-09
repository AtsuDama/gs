const Du = 0.2;
const Dv = 0.1;
var f = 0.025;
var k = 0.050;
var U;
var V;
var Un;
var Vn;
var U0 = 1.0;
var V0 = 1.0;

//var gui;
var slider_f;
var slider_k;
var slider_ni;

var field_width = 400;
var field_height = 400;

var ni = 1;

var fr;
var t;

var description1 = "Please click a point in the blue area."
var description2 = "You can also change the parameters and add clicks whenever you like."

function setup() {
  createCanvas(700,700);
  pixelDensity(1);
  //gui = createGui('Parameters', width+20, 0);
  //sliderRange(0.01, 0.08, 0.001);
  //gui.addGlobals('f', 'k');
  slider_f = createSlider(0.01, 0.08, f, 0.001);
  slider_f.position(field_width + 20, 40);
  slider_k = createSlider(0.01, 0.08, k, 0.001);
  slider_k.position(field_width + 20, 70);
  slider_ni = createSlider(1, 10, ni, 1);
  slider_ni.position(field_width + 20, 100);

  initialize();
  reset();
}

function draw() {
  background(255);
  f = slider_f.value();
  k = slider_k.value();
	ni = slider_ni.value();
  loadPixels();
  for (var x = 0; x < field_width; x++) {
		for (var y = 0; y < field_height; y++) {
	    var pix = (x + y * width) * 4;
	    pixels[pix + 0] = floor(V[x][y] * 200);
	    pixels[pix + 1] = floor((-V[x][y]+U[x][y])/(V[x][y]+U[x][y]) * 200);
	    pixels[pix + 2] = floor(U[x][y] * 200);
			//var h = U[x][y];
			//var s = 0.9;
			//var v = 1.0;
  		//var c = v * s;
  		//h = 4.0 * h;
  		//var z = c * (1 - abs(h % 2 - 1));
  		//var col;
  		//if (h >= 0 && h < 1) {
    	//	col = createVector(1, 1, 1).mult(v - c).add(createVector(c, z, 0));
  		//} else if (h >= 1 && h < 2) {
    	//	col = createVector(1, 1, 1).mult(v - c).add(createVector(z, c, 0));
  		//} else if (h >= 2 && h < 3) {
    	//	col = createVector(1, 1, 1).mult(v - c).add(createVector(0, c, z));
  		//} else if (h >= 3 && h < 4) {
    	//	col = createVector(1, 1, 1).mult(v - c).add(createVector(0, z, c));
  		//} else if (h >= 4 && h < 5) {
    	//	col = createVector(1, 1, 1).mult(v - c).add(createVector(z, 0, c));
  		//} else if (h >= 5 && h < 6) {
    	//	col = createVector(1, 1, 1).mult(v - c).add(createVector(c, 0, z));
			//}
			//pixels[pix + 0] = 255 * col.x;
	    //pixels[pix + 1] = 255 * col.y;
	    //pixels[pix + 2] = 255 * col.z;
	    pixels[pix + 3] = 200;
			}
    }
    updatePixels();

		for (var n = 0; n < ni; n++) {
    	for (var x = 0; x < field_width; x++) {
				for (var y = 0; y < field_height; y++) {
	    		var u = U[x][y];
	    		var v = V[x][y];
	    		var laplacianU = laplacian(U, x, y);
	    		var laplacianV = laplacian(V, x, y);
	    		Un[x][y] = u + (Du * laplacianU - u * v * v + f * (1 - u)) * 1.0;
	    		Vn[x][y] = v + (Dv * laplacianV + u * v * v - (k + f) * v) * 1.0;
				}
    	}

    	for (var x = 0; x < field_width; x++) {
				for (var y = 0; y < field_height; y++) {
	    		U[x][y] = constrain(Un[x][y], 0, 1);
	    		V[x][y] = constrain(Vn[x][y], 0, 1);
				}
    	}
		}
    textSize(24);
    textFont('Monospace');
		text("Parameters", field_width + 20, 20);
		textSize(16);
    text("Feed: "+ str(slider_f.value()), slider_f.x + slider_f.width + 10, slider_f.y + slider_f.height / 1.5);
    text("Kill: "+ str(slider_k.value()), slider_k.x + slider_k.width + 10, slider_k.y + slider_k.height / 1.5);
	  text("Iteration: "+ str(slider_ni.value()), slider_ni.x + slider_ni.width + 10, slider_ni.y + slider_ni.height / 1.5);
		if (frameCount % 10 == 0) {
			fr = frameRate();
		}
		text("t = " + str(t), field_width - 200, field_height + 25);
		t += 1
		text(str(floor(fr)) + " f/s", field_width - 70, field_height + 25);
		textSize(14);
		text(description1, 0, field_height + 70);
		text(description2, 0, field_height + 100);
}

function laplacian(Z, x, y) {
  var center, top, bottom, left, right;
  var total;

	var X = x + field_width;
	var Y = y + field_height;

  center = Z[X % field_width][Y % field_height];
  top = Z[X % field_width][(Y - 1) % field_height];
  bottom = Z[X % field_width][(Y + 1) % field_height];
  left = Z[(X - 1) % field_width][Y % field_height];
  right = Z[(X + 1) % field_width][Y % field_height];
  total = top + bottom + left + right - 4 * center;
  return total;
}

function initialize() {
	t = 0;
	U = [];
  V = [];
  Un = [];
  Vn = [];
  for (var x = 0; x < field_width; x++) {
		U[x] = [];
		V[x] = [];
		Un[x] = [];
		Vn[x] = [];
		for (var y = 0; y < field_height; y++) {
	    U[x][y] = U0;
	    V[x][y] = 0;
	    Un[x][y] = 0;
	    Vn[x][y] = 0;
		}
  }
}

function mouseClicked() {
  if ((mouseX < field_width && mouseX > 0) && (mouseY < field_height && mouseY > 0)) {
		for (var x = mouseX-20; x < mouseX+20; x++) {
	    for (var y = mouseY-20; y < mouseY+20; y++) {
				V[x][y] = V0;
	    }
		}
  }
}

function keyTyped() {
  if (key === 'c') {
		for (var x = field_width / 2 - 20; x < field_width / 2 + 20; x++) {
	    for (var y = field_height / 2 - 20; y < field_height / 2 + 20; y++) {
				V[x][y] = V0;
	    }
		}
	}
}

function reset() {
  var button = createButton("Reset");
  button.position(0, field_height + 10);
  button.mousePressed(initialize);
}

//function pause() {
//    let button = createButton("Pause");
//    button.position(80, height+20);
//    button.mousePressed(test);
//}

//function test() {
//    var framerate = frameRate();
//    if (framerate = !0) {
//			noLoop();
//    }
//    else {
//			Loop();
//    }
//}
//function hsv2rgb(_h, _s, _v) {
	//var h, s, v = _h, _s, _v;
  //var c = v * s;
  //h = 5.0 * h;
  //var x = c * (1 - abs(h % 2 - 1));
  //var col;
  //if (h >= 0 && h < 1) {
    //col = createVector(1, 1, 1).mult(v - c).add(createVector(c, x, 0));
  //} else if (h >= 1 && h < 2) {
    //col = createVector(1, 1, 1).mult(v - c).add(createVector(x, c, 0));
  //} else if (h >= 2 && h < 3) {
    //col = createVector(1, 1, 1).mult(v - c).add(createVector(0, c, x));
  //} else if (h >= 3 && h < 4) {
    //col = createVector(1, 1, 1).mult(v - c).add(createVector(0, x, c));
  //} else if (h >= 4 && h < 5) {
    //col = createVector(1, 1, 1).mult(v - c).add(createVector(x, 0, c));
  //} else if (h >= 5 && h < 6) {
    //col = createVector(1, 1, 1).mult(v - c).add(createVector(c, 0, x));
	//}
	//return col;
//}
