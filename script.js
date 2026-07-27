// ─── TYPING ───────────────────────────────────────────────
const phrases=["Software Engineer","Full-Stack Developer","Python Developer","Problem Solver","ECE Student @ VEMU"];
let pi=0,ci=0,del=false;
const typedEl=document.getElementById('typed');
function type(){
  const p=phrases[pi];
  if(!del){typedEl.textContent=p.slice(0,++ci);if(ci===p.length){del=true;setTimeout(type,1800);return}}
  else{typedEl.textContent=p.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length}}
  setTimeout(type,del?55:90);
}
setTimeout(type,1200);

// ─── SCROLL REVEAL ────────────────────────────────────────
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revObs.unobserve(e.target)}});
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

// ─── 3D PROJECT CARD TILT ─────────────────────────────────
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`perspective(800px) rotateY(${x*14}deg) rotateX(${-y*10}deg) translateZ(6px)`;
    card.style.setProperty('--mx',`${(e.clientX-r.left)/r.width*100}%`);
    card.style.setProperty('--my',`${(e.clientY-r.top)/r.height*100}%`);
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
  });
});

// ─── THREE.JS: PARTICLE GALAXY (HERO BG) ──────────────────
(function(){
  const canvas=document.getElementById('bg-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth,window.innerHeight);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.z=3;

  // Star particles
  const starCount=3000;
  const starGeo=new THREE.BufferGeometry();
  const positions=new Float32Array(starCount*3);
  const colors=new Float32Array(starCount*3);
  const c1=new THREE.Color('#7c3aed');
  const c2=new THREE.Color('#06b6d4');
  const cw=new THREE.Color('#ffffff');
  for(let i=0;i<starCount;i++){
    const r=Math.random()*12+2;
    const theta=Math.random()*Math.PI*2;
    const phi=Math.acos(2*Math.random()-1);
    positions[i*3]=r*Math.sin(phi)*Math.cos(theta);
    positions[i*3+1]=r*Math.sin(phi)*Math.sin(theta);
    positions[i*3+2]=r*Math.cos(phi);
    const t=Math.random();
    const col=t<0.33?c1:t<0.66?c2:cw;
    colors[i*3]=col.r;colors[i*3+1]=col.g;colors[i*3+2]=col.b;
  }
  starGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  starGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const starMat=new THREE.PointsMaterial({size:0.018,vertexColors:true,transparent:true,opacity:0.8,sizeAttenuation:true});
  const stars=new THREE.Points(starGeo,starMat);
  scene.add(stars);

  // Nebula ring
  const ringGeo=new THREE.TorusGeometry(4,0.6,2,80);
  const ringMat=new THREE.PointsMaterial({size:0.012,color:'#7c3aed',transparent:true,opacity:0.25});
  const ring=new THREE.Points(ringGeo,ringMat);
  ring.rotation.x=Math.PI/3;
  scene.add(ring);

  let mouseX=0,mouseY=0;
  document.addEventListener('mousemove',e=>{
    mouseX=(e.clientX/window.innerWidth-0.5)*0.4;
    mouseY=(e.clientY/window.innerHeight-0.5)*0.4;
  });

  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });

  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t+=0.0005;
    stars.rotation.y=t*0.15+mouseX*0.3;
    stars.rotation.x=t*0.05+mouseY*0.2;
    ring.rotation.z=t*0.2;
    ring.rotation.y=t*0.1;
    renderer.render(scene,camera);
  }
  animate();
})();

// ─── THREE.JS: SKILLS ORB ─────────────────────────────────
(function(){
  const wrap=document.getElementById('skills-canvas-wrap');
  const canvas=document.getElementById('skills-canvas');
  if(!wrap||!canvas)return;

  const W=wrap.offsetWidth||320,H=wrap.offsetHeight||320;
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(W,H);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,W/H,0.1,100);
  camera.position.z=2.8;

  // Glowing orb
  const orbGeo=new THREE.SphereGeometry(1,64,64);
  const orbMat=new THREE.MeshPhongMaterial({
    color:0x0a0f1e,emissive:0x1a0a3e,
    transparent:true,opacity:0.7,wireframe:false,
    shininess:80
  });
  const orb=new THREE.Mesh(orbGeo,orbMat);
  scene.add(orb);

  // Wireframe overlay
  const wireMat=new THREE.MeshBasicMaterial({color:0x7c3aed,wireframe:true,transparent:true,opacity:0.15});
  const wire=new THREE.Mesh(orbGeo,wireMat);
  wire.scale.setScalar(1.01);
  scene.add(wire);

  // Skill dots on sphere surface
  const skills=['Python','C++','Java','JS','React','Django','MySQL','NumPy','Pandas','Git','DSA','OOP'];
  const dotGeo=new THREE.SphereGeometry(0.045,8,8);
  skills.forEach((_,i)=>{
    const phi=Math.acos(-1+(2*i)/skills.length);
    const theta=Math.sqrt(skills.length*Math.PI)*phi;
    const dotMat=new THREE.MeshBasicMaterial({color:i%2===0?0x7c3aed:0x06b6d4});
    const dot=new THREE.Mesh(dotGeo,dotMat);
    dot.position.setFromSphericalCoords(1.05,phi,theta);
    scene.add(dot);
  });

  // Rings
  [0,Math.PI/2,Math.PI/3].forEach((ang,i)=>{
    const rGeo=new THREE.TorusGeometry(1.15+i*0.06,0.005,2,80);
    const rMat=new THREE.MeshBasicMaterial({color:i===0?0x7c3aed:0x06b6d4,transparent:true,opacity:0.4});
    const r=new THREE.Mesh(rGeo,rMat);
    r.rotation.x=ang;
    scene.add(r);
  });

  const light=new THREE.PointLight(0x7c3aed,2,10);
  light.position.set(2,2,2);
  scene.add(light);
  const light2=new THREE.PointLight(0x06b6d4,1.5,10);
  light2.position.set(-2,-1,1);
  scene.add(light2);
  scene.add(new THREE.AmbientLight(0x1a1a3e,1));

  // Drag to rotate
  let isDragging=false,prevX=0,prevY=0,velX=0,velY=0;
  canvas.addEventListener('mousedown',e=>{isDragging=true;prevX=e.clientX;prevY=e.clientY;velX=velY=0});
  window.addEventListener('mouseup',()=>{isDragging=false});
  window.addEventListener('mousemove',e=>{
    if(!isDragging)return;
    velX=e.clientX-prevX;velY=e.clientY-prevY;
    orb.rotation.y+=velX*0.012;wire.rotation.y+=velX*0.012;
    orb.rotation.x+=velY*0.012;wire.rotation.x+=velY*0.012;
    scene.children.forEach(c=>{if(c!==orb&&c!==wire){c.rotation.y+=velX*0.012;c.rotation.x+=velY*0.012}});
    prevX=e.clientX;prevY=e.clientY;
  });

  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t+=0.005;
    if(!isDragging){
      orb.rotation.y+=velX*0.003+0.004;wire.rotation.y+=velX*0.003+0.004;
      orb.rotation.x+=velY*0.003;wire.rotation.x+=velY*0.003;
      scene.children.forEach(c=>{if(c!==orb&&c!==wire){c.rotation.y+=0.004}});
      velX*=0.95;velY*=0.95;
    }
    light.position.x=Math.sin(t)*2;light.position.z=Math.cos(t)*2;
    renderer.render(scene,camera);
  }
  animate();
})();