var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

function LightingScene() {
    CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this,5);

    // Scene elements
    this.table = new MyTable(this);
    this.wall = new Plane(this);
    this.leftWall = new MyQuad(this, -1, 2, -0.5, 1.5);
    this.floor = new MyQuad(this, 0, 10, 0, 12);

    this.boardA = new Plane(this,BOARD_A_DIVISIONS, -0.3 , 1.3);
    this.boardB = new Plane(this,BOARD_B_DIVISIONS);

    this.prism = new MyPrism(this,8,20);
    this.cylinder = new MyCylinder(this,8,20);
    this.lamp = new MyLamp(this,8,20);

    // Materials
    this.materialDefault = new CGFappearance(this);

    this.materialA = new CGFappearance(this);
    this.materialA.setAmbient(0.3, 0.3, 0.3, 1);
    this.materialA.setDiffuse(0.6, 0.6, 0.6, 1);
    this.materialA.setSpecular(0, 0.2, 0.8, 1);
    this.materialA.setShininess(120);

    this.materialB = new CGFappearance(this);
    this.materialB.setAmbient(0.3, 0.3, 0.3, 1);
    this.materialB.setDiffuse(0.6, 0.6, 0.6, 1);
    this.materialB.setSpecular(0.8, 0.8, 0.8, 1);
    this.materialB.setShininess(120);

    this.materialC = new CGFappearance(this);
    this.materialC.setAmbient(0.25, 0.25, 0.25, 1);
    this.materialC.setDiffuse(0.4, 0.4, 0.4, 1);
    this.materialC.setSpecular(0.774597, 0.774597, 0.774597, 1);
    this.materialC.setShininess(1);

    this.materialD = new CGFappearance(this);
    this.materialD.setAmbient(0.3, 0.3, 0.3, 1);
    this.materialD.setDiffuse(0.4, 0.2, 0, 1);
    this.materialD.setSpecular(0.1, 0.1, 0.1, 1);
    this.materialD.setShininess(1000);

    this.materialWall = new CGFappearance(this);
    this.materialWall.setAmbient(0.05, 0.05, 0.05, 1);
    this.materialWall.setDiffuse(0.5, 0.5, 0.4, 1);
    this.materialWall.setSpecular(0.7, 0.7, 0.04, 1);
    this.materialWall.setShininess(100);

    this.materialFloor = new CGFappearance(this);
    this.materialFloor.setAmbient(0.2125, 0.1275, 0.054, 1);
    this.materialFloor.setDiffuse(0.714, 0.4284, 0.18144, 1);
    this.materialFloor.setSpecular(0.393548, 0.271906, 0.166721, 1);
    this.materialFloor.setShininess(25);

    this.enableTextures(true);

    this.tableAppearance = new CGFappearance(this);
    this.tableAppearance.loadTexture("../resources/images/table.png");
    this.tableAppearance.setAmbient(0.8, 0.8, 0.8, 1);
    this.tableAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
    this.tableAppearance.setSpecular(0.2, 0.2, 0.2, 1);
    this.tableAppearance.setShininess(1000);
    
    this.floorAppearance = new CGFappearance(this);
    this.floorAppearance.loadTexture("../resources/images/floor.png");
    
    this.windowAppearance = new CGFappearance(this);
    this.windowAppearance.loadTexture("../resources/images/window.png");
    this.windowAppearance.setTextureWrap("CLAMP_TO_EDGE","CLAMP_TO_EDGE");

    
    this.slidesAppearance = new CGFappearance(this);
    this.slidesAppearance.loadTexture("../resources/images/slides.png");
    this.slidesAppearance.setTextureWrap("CLAMP_TO_EDGE","CLAMP_TO_EDGE");
    this.slidesAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.slidesAppearance.setDiffuse(0.9, 0.9, 0.9, 1);
    this.slidesAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.slidesAppearance.setShininess(200);

    this.boardAppearance = new CGFappearance(this);
    this.boardAppearance.loadTexture("../resources/images/board.png");
    this.boardAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.boardAppearance.setDiffuse(0.2, 0.2, 0.2, 1);
    this.boardAppearance.setSpecular(0.5, 0.5, 0.5, 1);
    this.boardAppearance.setShininess(5);

    this.columnAppearance = new CGFappearance(this);
    this.columnAppearance.loadTexture("../resources/images/column.png");

}
;

LightingScene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(30, 30, 30),vec3.fromValues(0, 0, 0));
}
;

LightingScene.prototype.initLights = function() {
    //this.setGlobalAmbientLight(0.5,0.5,0.5, 1.0);
    this.setGlobalAmbientLight(0, 0, 0, 0);

    // Positions for four lights
    this.lights[0].setPosition(4, 6, 1, 1);
    this.lights[0].setVisible(true);
    // show marker on light position (different from enabled)

    this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
    this.lights[1].setVisible(true);
    // show marker on light position (different from enabled)

    this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);
    this.lights[2].setVisible(true);
    // show marker on light position (different from enabled)

    this.lights[3].setPosition(4, 6.0, 5.0, 1.0);
    this.lights[3].setVisible(true);
    // show marker on light position (different from enabled)

    this.lights[4].setPosition(0, 4, 7.5, 1);
    this.lights[4].setVisible(true);

    this.lights[0].setAmbient(0, 0, 0, 1);
    this.lights[0].setSpecular(1.0, 1.0, 0, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();

    this.lights[1].setAmbient(0, 0, 0, 1);
    this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[1].enable();

    this.lights[2].setConstantAttenuation(0);
    this.lights[2].setLinearAttenuation(1);
    this.lights[2].setQuadraticAttenuation(0);
    this.lights[2].setAmbient(0, 0, 0, 1);
    this.lights[2].setSpecular(1.0, 1.0, 1.0, 1);
    this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[2].enable();

    this.lights[3].setConstantAttenuation(0);
    this.lights[3].setLinearAttenuation(0);
    this.lights[3].setQuadraticAttenuation(0.2);
    this.lights[3].setAmbient(0, 0, 0, 1);
    this.lights[3].setSpecular(1.0, 1.0, 0, 1);
    this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[3].enable();

    this.lights[4].setAmbient(0, 0, 0, 1);
    this.lights[4].setSpecular(1.0, 1.0, 1.0, 1);
    this.lights[4].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[4].enable();
}
;

LightingScene.prototype.updateLights = function() {
    for (i = 0; i < this.lights.length; i++)
        this.lights[i].update();
}

LightingScene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation)
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Update all lights used
    this.updateLights();

    // Draw axis
    this.axis.display();

    this.materialDefault.apply();

    // ---- END Background, camera and axis setup

    // ---- BEGIN Geometric transformation section

    // ---- END Geometric transformation section

    // ---- BEGIN Primitive drawing section

    // Floor
    this.pushMatrix();
    this.translate(7.5, 0, 7.5);
    this.rotate(-90 * degToRad, 1, 0, 0);
    this.scale(15, 15, 0.2);
    this.floorAppearance.apply();
    this.floor.display();
    this.popMatrix();

    // Left Wall
    this.pushMatrix();
    this.translate(0, 4, 7.5);
    this.rotate(90 * degToRad, 0, 1, 0);
    this.scale(15, 8, 0.2);
    this.windowAppearance.apply();
    this.leftWall.display();
    this.popMatrix();

    // Plane Wall
    this.pushMatrix();
    this.translate(7.5, 4, 0);
    this.scale(15, 8, 0.2);
    this.materialWall.apply();
    this.wall.display();
    this.popMatrix();

    // First Table
    this.pushMatrix();
    this.translate(5, 0, 8);
    this.table.display();
    this.popMatrix();

    // Second Table
    this.pushMatrix();
    this.translate(12, 0, 8);
    this.table.display();
    this.popMatrix();

    // Board A
    this.pushMatrix();
    this.translate(4, 4.5, 0.2);
    this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);

    this.slidesAppearance.apply();
    this.boardA.display();
    this.popMatrix();

    // Board B
    this.pushMatrix();
    this.translate(10.5, 4.5, 0.2);
    this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);

    this.boardAppearance.apply();
    this.boardB.display();
    this.popMatrix();

    this.pushMatrix();

    this.translate(1, 0, 14);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.scale(1, 1, 8);
    this.prism.display();
    this.popMatrix();

    //Column1
    this.pushMatrix();
    this.translate(14, 0, 14);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.scale(1, 1, 8);
    this.columnAppearance.apply();
    this.cylinder.display();
    this.popMatrix();

    //Column near origin
    this.pushMatrix();
    this.translate(1, 0, 1);
    this.rotate(Math.PI / 2, 0, 1, 0);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.scale(1, 1, 8);
    this.columnAppearance.apply();
    this.cylinder.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(7, 7, 7);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.lamp.display();
    this.popMatrix();

    // ---- END Primitive drawing section
}
;
