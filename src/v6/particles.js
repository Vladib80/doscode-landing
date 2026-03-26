import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  AdditiveBlending,
  NormalBlending
} from 'three';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isMobile = () => window.innerWidth < 768;

/**
 * Creates an IntersectionObserver that calls `onVisible(true/false)` when
 * the target element enters or leaves the viewport.
 */
function createVisibilityObserver(element, onVisible) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => onVisible(entry.isIntersecting));
    },
    { threshold: 0 }
  );
  observer.observe(element);
  return observer;
}

/**
 * Shared renderer factory – keeps boilerplate in one place.
 */
function createRenderer(canvas) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  return renderer;
}

/**
 * Mark the canvas parent so CSS can react to WebGL failures.
 */
function markFailed(canvas) {
  if (canvas && canvas.parentElement) {
    canvas.parentElement.dataset.particlesFailed = 'true';
  }
}

// ---------------------------------------------------------------------------
// 1. initHeroSphere
// ---------------------------------------------------------------------------

export function initHeroSphere(canvas) {
  try {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = createRenderer(canvas);

    // Particles -----------------------------------------------------------
    const count = isMobile() ? 1000 : 2000;
    const positions = new Float32Array(count * 3);
    const radius = 2.5;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const material = new PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      opacity: 0.7,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: false
    });

    const points = new Points(geometry, material);
    scene.add(points);

    // Mouse parallax ------------------------------------------------------
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize --------------------------------------------------------------
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);

    // Animation -----------------------------------------------------------
    let animId = 0;
    let isVisible = false;
    const clock = { start: performance.now() };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = (performance.now() - clock.start) * 0.001;

      points.rotation.y += 0.001;
      material.size = 2 + Math.sin(elapsed * 0.5) * 0.3;

      scene.rotation.x += (mouse.y * 0.05 - scene.rotation.x) * 0.05;
      scene.rotation.y += (mouse.x * 0.05 - scene.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    const observer = createVisibilityObserver(canvas, (visible) => {
      isVisible = visible;
    });

    animate();

    // Cleanup -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  } catch (err) {
    markFailed(canvas);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 2. initWaveTerrain
// ---------------------------------------------------------------------------

export function initWaveTerrain(canvas, opts = {}) {
  try {
    const scene = new Scene();
    const isDark = opts.dark !== false;
    const camera = new PerspectiveCamera(
      isDark ? 60 : 55,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    // Light bg variant: pull camera back and flatten angle for wider coverage
    camera.position.set(0, isDark ? 8 : 6, isDark ? 12 : 16);
    camera.lookAt(0, 0, 0);

    const renderer = createRenderer(canvas);

    // Particles – flat grid -----------------------------------------------
    const mobile = isMobile();
    const count = isDark ? (mobile ? 800 : 1500) : (mobile ? 1200 : 2500);
    const gridSize = Math.ceil(Math.sqrt(count));
    const spacing = isDark ? 0.6 : 0.55;
    const halfGrid = (gridSize * spacing) / 2;

    const positions = new Float32Array(gridSize * gridSize * 3);
    let idx = 0;
    for (let ix = 0; ix < gridSize; ix++) {
      for (let iz = 0; iz < gridSize; iz++) {
        positions[idx] = ix * spacing - halfGrid;
        positions[idx + 1] = 0;
        positions[idx + 2] = iz * spacing - halfGrid;
        idx += 3;
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const material = new PointsMaterial({
      color: isDark ? 0xffffff : 0x0a0a0f,
      size: isDark ? 1.5 : 1.8,
      transparent: true,
      opacity: isDark ? 0.5 : 0.18,
      blending: isDark ? AdditiveBlending : NormalBlending,
      depthWrite: false,
      sizeAttenuation: false
    });

    const points = new Points(geometry, material);
    scene.add(points);

    // Resize --------------------------------------------------------------
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);

    // Animation -----------------------------------------------------------
    let animId = 0;
    let isVisible = false;
    const clock = { start: performance.now() };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = (performance.now() - clock.start) * 0.001;
      const posAttr = geometry.getAttribute('position');
      const arr = posAttr.array;

      let i = 0;
      for (let ix = 0; ix < gridSize; ix++) {
        for (let iz = 0; iz < gridSize; iz++) {
          const x = arr[i];
          const z = arr[i + 2];
          arr[i + 1] = Math.sin(x * 0.3 + time) * Math.cos(z * 0.3 + time) * 2;
          i += 3;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const observer = createVisibilityObserver(canvas, (visible) => {
      isVisible = visible;
    });

    animate();

    // Cleanup -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  } catch (err) {
    markFailed(canvas);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 3. initCtaSphere
// ---------------------------------------------------------------------------

export function initCtaSphere(canvas) {
  try {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    // Offset camera so the sphere is half off-screen to the left
    camera.position.set(3, 0, 5);
    camera.lookAt(-2, 0, 0);

    const renderer = createRenderer(canvas);

    // Particles -----------------------------------------------------------
    const count = isMobile() ? 600 : 1200;
    const positions = new Float32Array(count * 3);
    const radius = 3;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const material = new PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      opacity: 0.7,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: false
    });

    const points = new Points(geometry, material);
    // Shift the sphere to the left so it's half off-screen
    points.position.x = -4;
    scene.add(points);

    // Resize --------------------------------------------------------------
    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    window.addEventListener('resize', onResize);

    // Animation -----------------------------------------------------------
    let animId = 0;
    let isVisible = false;
    const clock = { start: performance.now() };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = (performance.now() - clock.start) * 0.001;

      // Slower rotation than hero sphere
      points.rotation.y += 0.0005;
      material.size = 2 + Math.sin(elapsed * 0.4) * 0.2;

      renderer.render(scene, camera);
    };

    const observer = createVisibilityObserver(canvas, (visible) => {
      isVisible = visible;
    });

    animate();

    // Cleanup -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  } catch (err) {
    markFailed(canvas);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 4. initFloatingDots — Canvas 2D, no Three.js
// ---------------------------------------------------------------------------

export function initFloatingDots(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      markFailed(canvas);
      return null;
    }

    const mobile = isMobile();
    const dotCount = mobile ? 50 : 100;

    // Ensure canvas dimensions match CSS layout
    const syncSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    syncSize();

    // Dot data
    const dots = [];
    for (let i = 0; i < dotCount; i++) {
      const speed = 0.15 + Math.random() * 0.35;
      const angle = Math.random() * Math.PI * 2;
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random() * 3,
        opacity: 0.1 + Math.random() * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      });
    }

    // Resize handler
    const onResize = () => {
      syncSize();
      // Re-scatter any dots that fell outside after resize
      for (const d of dots) {
        if (d.x > canvas.width) d.x = Math.random() * canvas.width;
        if (d.y > canvas.height) d.y = Math.random() * canvas.height;
      }
    };
    window.addEventListener('resize', onResize);

    // Animation
    let animId = 0;
    let isVisible = false;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;

        // Wrap around edges
        if (d.x < -d.r) d.x = w + d.r;
        else if (d.x > w + d.r) d.x = -d.r;
        if (d.y < -d.r) d.y = h + d.r;
        else if (d.y > h + d.r) d.y = -d.r;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${d.opacity})`;
        ctx.fill();
      }
    };

    const observer = createVisibilityObserver(canvas, (visible) => {
      isVisible = visible;
    });

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  } catch (err) {
    markFailed(canvas);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 5. initFloatingDotsDark — Vortex/spiral particle field for light backgrounds
//    Particles stream from edges, swirl toward center with depth perspective
// ---------------------------------------------------------------------------

export function initFloatingDotsDark(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      markFailed(canvas);
      return null;
    }

    const mobile = isMobile();
    const particleCount = mobile ? 200 : 600;

    const syncSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    syncSize();

    // Each particle lives in polar coords around the canvas center
    // z = depth (0 = far away/small, 1 = close/big)
    function createParticle(scattered) {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.sqrt(cx * cx + cy * cy) * 1.3;

      // Start from outer edge (scattered=true means random position for init)
      const dist = scattered
        ? 30 + Math.random() * maxR
        : maxR * (0.85 + Math.random() * 0.4);
      const angle = Math.random() * Math.PI * 2;
      const z = 0.05 + Math.random() * 0.95; // depth

      return {
        angle,
        dist,
        z,
        // Inward speed — closer particles move faster (perspective)
        speed: (0.12 + Math.random() * 0.4) * z,
        // Swirl rotation speed — all swirl same direction for cohesion
        swirl: (0.0008 + Math.random() * 0.0025),
        // Size based on depth (1px to 4.5px)
        baseR: 0.6 + z * 3.5,
        // Opacity based on depth
        baseOpacity: 0.06 + z * 0.32
      };
    }

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const onResize = () => syncSize();
    window.addEventListener('resize', onResize);

    let animId = 0;
    let isVisible = false;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.sqrt(cx * cx + cy * cy) * 1.2;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move inward toward center
        p.dist -= p.speed;
        // Swirl rotation
        p.angle += p.swirl;

        // Convert polar to cartesian
        const x = cx + Math.cos(p.angle) * p.dist;
        const y = cy + Math.sin(p.angle) * p.dist;

        // Fade based on distance from center (far = faint, near = stronger)
        const distRatio = p.dist / maxR;
        const opacity = p.baseOpacity * (0.3 + (1 - distRatio) * 0.7);
        const r = p.baseR * (0.5 + (1 - distRatio) * 0.5);

        // Draw
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 10, 15, ${opacity})`;
        ctx.fill();

        // Respawn when reaching center area or going off-screen
        if (p.dist < 20 || x < -10 || x > w + 10 || y < -10 || y > h + 10) {
          particles[i] = createParticle(false);
        }
      }
    };

    const observer = createVisibilityObserver(canvas, (visible) => {
      isVisible = visible;
    });

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  } catch (err) {
    markFailed(canvas);
    return null;
  }
}
