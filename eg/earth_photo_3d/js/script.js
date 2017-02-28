(function(){

var camera, scene, renderer;
var controls;
var objects = [];
var targets = {
    table: [],
    sphere: []
};

var target;
var phi = 0,
    theta = 0;

var x = 0;
var y = 0;

var table = [],
imgs = [
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',
    'img/11.jpg',
    'img/12.jpg',
    'img/13.jpg',
    'img/14.jpg',
    'img/15.jpg',
    'img/16.jpg',
    'img/17.jpg',
    'img/18.jpg'
];
for(var i=0;i<350;i++){
    table.push(i);
}

init();
animate();

function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

function init() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;
    

    scene = new THREE.Scene();

    // table
    for (var i = 0; i < table.length; i += 3) {

        var element = document.createElement('div');
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

        var img = document.createElement("img");
        var num = i % imgs.length; 
        img.src = imgs[num];

        var symbol = document.createElement('div');
        symbol.className = 'symbol';
        symbol.appendChild(img);
        element.appendChild(symbol);

        var object = new THREE.CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);

        objects.push(object);

        var objectsss = new THREE.Object3D();

        targets.table.push(objectsss);

    }

    // sphere
    var vector = new THREE.Vector3();
    target = vector;

    for (var i = 0, l = objects.length; i < l; i++) {

        var phi = Math.acos(-1 + (2 * i) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;

        var objectss = new THREE.Object3D();

        objectss.position.x = 800 * Math.cos(theta) * Math.sin(phi);
        objectss.position.y = 800 * Math.sin(theta) * Math.sin(phi);
        objectss.position.z = 800 * Math.cos(phi);
        vector.copy(objectss.position).multiplyScalar(2);

        objectss.lookAt(vector);

        targets.sphere.push(objectss);

    }

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.noZoom = true;
    controls.noPan = true;
    controls.rotateSpeed = 0.2;
    controls.addEventListener('change', render);
    transform(targets.sphere, 1000);
}

function transform(targets, duration) {

    TWEEN.removeAll();

    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
            .to({
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}
function animate() {
    requestAnimationFrame(animate);
    ror();
    TWEEN.update();
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

function ror() {
    controls.move(x, y);
    x += 5;
}

})();