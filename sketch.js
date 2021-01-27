let colours = ["red", "blue", "green", "yellow"];
let population;
let dt = 0.1;
let F = 10;
let B = 0;
let Cwidth = 400;
let Cheight = 400;
let Cdepth = 400;
let maxV = 10;

function setup() {
  createCanvas(Cwidth + 10, Cheight + 10, WEBGL);
  population = new popu();
  population.addParticles(300)
  cam = createCamera();
  cam.setPosition(400, 600, 600);
  cam.lookAt(Cwidth / 2 + 5, Cheight / 2 + 5, Cdepth / 2 + 5);

}

function draw() {
  background(220);
  specularColor(255, 255, 255);
  ambientLight(150);
  pointLight(50, 50, 50, 0, 0, 0);
  orbitControl();
  //population.addParticles(1)
  population.run()
  population.render();
  push();
  noFill();
  strokeWeight(3);
  translate(Cwidth / 2 - 5, Cheight / 2 - 5, Cdepth / 2 - 5)
  box(Cwidth + 15, Cheight + 15, Cdepth + 15);
  pop();
}

class popu {
  constructor() {
    this.particles = [];
  }

  run() {
    for (let p = 0; p < this.particles.length; p++) {
      this.particles[p].run(this.particles);
    }
  }

  render() {
    for (let p = 0; p < this.particles.length; p++) {
      this.particles[p].render();
    }
  }

  addParticles(n) {
    for (let i = 0; i < n; i++) {
      this.particles.push(new particle(random(colours)));
    }
  }
}

class particle {
  constructor(colour) {
    this.pos = createVector(random(-200, 200), random(-200, 200), random(-200, 200));
    this.vel = createVector(0, 0, 0);
    this.colour = colour;

    if (colour == "red") {
      this.kr = -1;
      this.kg = 2;
      this.kb = -1;
      this.ky = -2;
    } else if (colour == "green") {
      this.kr = -2;
      this.kg = 2;
      this.kb = 2;
      this.ky = 0;
    } else if (colour == "blue") {
      this.kr = 1;
      this.kg = -1;
      this.kb = 3;
      this.ky = 1;
    } else if (colour == "yellow") {
      this.kr = 1;
      this.kg = -1;
      this.kb = 3;
      this.ky = 2;
    }
  }

  getForceTo(that) {
    let k;

    if (that.colour == "red") {
      k = this.kr;
    } else if (that.colour == "green") {
      k = this.kg;
    } else if (that.colour == "blue") {
      k = this.kb;
    } else if (that.colour == "yellow") {
      k = this.ky;
    }

    let between = p5.Vector.sub(this.pos, that.pos);
    let dist = between.mag();
    let mag;

    if (dist < 10) {
      mag = 4000 * sin((dist / 10) * PI);
    } else if (dist < 60) {
      mag = -k * (dist - 10);
    } else if (dist < 100)
      mag = k * (dist - 60) - (k * 50);
    else {
      mag = 0;
    }

    between.normalize();
    return between.mult(mag);

  }

  run(all) {
    let total = createVector(0, 0, 0);

    for (let p = 0; p < all.length; p++) {
      total.add(this.getForceTo(all[p]));
    }

    let drag = p5.Vector.mult(this.vel, this.vel.mag() ^ 2)
    total.sub(drag.mult(F));

    let brown = p5.Vector.random3D()
    total.add(brown.mult(B));

    this.vel.add(total);
    this.vel.limit(maxV);
    this.pos.add(this.vel.mult(dt));

    if (this.pos.x > Cwidth / 2) {
      this.pos.x = Cwidth / 2;
      this.vel.x = 0;
    }

    if (this.pos.x < -Cwidth / 2) {
      this.pos.x = -Cwidth / 2;
      this.vel.x = 0;
    }

    if (this.pos.y > Cheight / 2) {
      this.pos.y = Cheight / 2;
      this.vel.y = 0;
    }

    if (this.pos.y < -Cheight / 2) {
      this.pos.y = -Cheight / 2;
      this.vel.y = 0;
    }

    if (this.pos.z > Cdepth / 2) {
      this.pos.z = Cdepth / 2;
      this.vel.z = 0;
    }

    if (this.pos.z < -Cdepth / 2) {
      this.pos.z = -Cdepth / 2;
      this.vel.z = 0;
    }



  }

  render() {
    specularMaterial(this.colour);
    strokeWeight(0);
    push();
    translate(this.pos.x + Cwidth / 2 + 5, this.pos.y + Cheight / 2 + 5, this.pos.z + Cdepth / 2 + 5)
    sphere(3);
    pop();
  }
}