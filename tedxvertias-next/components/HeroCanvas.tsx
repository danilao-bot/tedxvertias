'use client';
import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const c = ctx;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let animId: number;
    const particles: {x:number,y:number,vx:number,vy:number,r:number,isRed:boolean,life:number,decay:number,trail:{x:number,y:number}[],maxTrail:number}[] = [];
    let scanY = 0;
    let scanDir = 1;
    const hexCells: {x:number,y:number,size:number,pulse:number,pulseSpeed:number,active:boolean}[] = [];
    const PARTICLE_COUNT = 90;

    const buildHexGrid = () => {
      hexCells.length = 0;
      const size = 36;
      const colW = size * 1.732;
      const rowH = size * 1.5;
      for (let row = -1; row < H / rowH + 2; row++) {
        for (let col = -1; col < W / colW + 2; col++) {
          const x = col * colW + (row % 2) * colW / 2;
          const y = row * rowH;
          hexCells.push({ x, y, size, pulse: Math.random(), pulseSpeed: 0.003 + Math.random() * 0.005, active: Math.random() < 0.08 });
        }
      }
    };

    const hexPath = (x: number, y: number, s: number) => {
      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 180 * (60 * i - 30);
        const px = x + s * Math.cos(angle);
        const py = y + s * Math.sin(angle);
        i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
      }
      c.closePath();
    };

    const spawnParticle = (random: boolean) => {
      const isRed = Math.random() < 0.4;
      particles.push({
        x: random ? Math.random() * W : (Math.random() < 0.5 ? -5 : W + 5),
        y: random ? Math.random() * H : Math.random() * H,
        vx: (Math.random() - 0.5) * (isRed ? 0.8 : 0.3),
        vy: (Math.random() - 0.5) * (isRed ? 0.8 : 0.3),
        r: isRed ? (Math.random() * 2 + 1) : (Math.random() * 1.2 + 0.3),
        isRed,
        life: 1,
        decay: 0.001 + Math.random() * 0.002,
        trail: [],
        maxTrail: isRed ? 12 : 5
      });
    };

    const drawConnections = () => {
      const MAX_DIST = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.6 * Math.min(particles[i].life, particles[j].life);
            const bothRed = particles[i].isRed && particles[j].isRed;
            const eitherRed = particles[i].isRed || particles[j].isRed;
            c.beginPath();
            c.moveTo(particles[i].x, particles[i].y);
            c.lineTo(particles[j].x, particles[j].y);
            if (bothRed) {
              c.strokeStyle = `rgba(235,0,40,${alpha * 0.9})`;
              c.lineWidth = 0.8;
            } else if (eitherRed) {
              c.strokeStyle = `rgba(200,0,30,${alpha * 0.5})`;
              c.lineWidth = 0.5;
            } else {
              c.strokeStyle = `rgba(120,120,120,${alpha * 0.2})`;
              c.lineWidth = 0.3;
            }
            c.stroke();
          }
        }
      }
    };

    let t = 0;
    const draw = () => {
      t += 0.016;
      c.clearRect(0, 0, W, H);

      hexCells.forEach(h => {
        h.pulse += h.pulseSpeed;
        if (h.pulse > 1) { h.pulse = 0; h.active = Math.random() < 0.08; }
        const glow = h.active ? (0.5 + 0.5 * Math.sin(h.pulse * Math.PI)) : 0;
        hexPath(h.x, h.y, h.size - 1);
        if (h.active) {
          c.strokeStyle = `rgba(235,0,40,${0.06 + glow * 0.25})`;
          c.lineWidth = 1;
          c.fillStyle = `rgba(235,0,40,${glow * 0.04})`;
          c.fill();
        } else {
          c.strokeStyle = `rgba(255,255,255,0.025)`;
          c.lineWidth = 0.5;
        }
        c.stroke();
      });

      scanY += scanDir * 1.2;
      if (scanY > H + 60) scanDir = -1;
      if (scanY < -60) scanDir = 1;

      const scanGrad = c.createLinearGradient(0, scanY - 80, 0, scanY + 80);
      scanGrad.addColorStop(0, 'rgba(235,0,40,0)');
      scanGrad.addColorStop(0.3, 'rgba(235,0,40,0.08)');
      scanGrad.addColorStop(0.5, 'rgba(235,0,40,0.28)');
      scanGrad.addColorStop(0.7, 'rgba(235,0,40,0.08)');
      scanGrad.addColorStop(1, 'rgba(235,0,40,0)');
      c.fillStyle = scanGrad;
      c.fillRect(0, scanY - 80, W, 160);

      c.save();
      c.shadowColor = 'rgba(235,0,40,1)';
      c.shadowBlur = 18;
      c.beginPath();
      c.moveTo(0, scanY);
      c.lineTo(W, scanY);
      c.strokeStyle = 'rgba(255,60,80,0.95)';
      c.lineWidth = 2;
      c.stroke();
      c.shadowBlur = 6;
      c.beginPath();
      c.moveTo(0, scanY);
      c.lineTo(W, scanY);
      c.strokeStyle = 'rgba(255,120,130,1)';
      c.lineWidth = 0.8;
      c.stroke();
      c.restore();

      drawConnections();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrail) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        for (let k = 0; k < p.trail.length - 1; k++) {
          const alpha = (k / p.trail.length) * p.life * (p.isRed ? 0.6 : 0.2);
          c.beginPath();
          c.moveTo(p.trail[k].x, p.trail[k].y);
          c.lineTo(p.trail[k + 1].x, p.trail[k + 1].y);
          c.strokeStyle = p.isRed ? `rgba(235,0,40,${alpha})` : `rgba(180,180,180,${alpha})`;
          c.lineWidth = p.isRed ? 1.2 : 0.6;
          c.stroke();
        }

        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (p.isRed) {
          c.shadowColor = 'rgba(235,0,40,0.9)';
          c.shadowBlur = 10;
          c.fillStyle = `rgba(235,0,40,${p.life})`;
        } else {
          c.shadowBlur = 0;
          c.fillStyle = `rgba(200,200,200,${p.life * 0.5})`;
        }
        c.fill();
        c.shadowBlur = 0;

        if (p.life <= 0 || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
          particles.splice(i, 1);
          spawnParticle(false);
        }
      }

      while (particles.length < PARTICLE_COUNT) spawnParticle(false);

      const bSize = 28, bGap = 12, bAlpha = 0.35;
      const corners = [[bGap, bGap, 1, 1], [W - bGap, bGap, -1, 1], [bGap, H - bGap, 1, -1], [W - bGap, H - bGap, -1, -1]] as const;
      c.strokeStyle = `rgba(235,0,40,${bAlpha})`;
      c.lineWidth = 1.5;
      corners.forEach(([cx, cy, dx, dy]) => {
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + dx * bSize, cy); c.stroke();
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, cy + dy * bSize); c.stroke();
      });

      const pulse = 0.3 + 0.2 * Math.sin(t * 2);
      const cx = W / 2, cy = H / 2;
      c.strokeStyle = `rgba(235,0,40,${pulse * 0.4})`;
      c.lineWidth = 0.8;
      c.beginPath(); c.moveTo(cx - 40, cy); c.lineTo(cx + 40, cy); c.stroke();
      c.beginPath(); c.moveTo(cx, cy - 40); c.lineTo(cx, cy + 40); c.stroke();
      c.beginPath();
      c.arc(cx, cy, 20 + 5 * Math.sin(t * 3), 0, Math.PI * 2);
      c.strokeStyle = `rgba(235,0,40,${pulse * 0.25})`;
      c.stroke();

      animId = requestAnimationFrame(draw);
    };

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      buildHexGrid();
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) spawnParticle(true);
    };

    resize();
    initParticles();
    draw();

    const handleResize = () => {
      cancelAnimationFrame(animId);
      resize();
      initParticles();
      draw();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas id="heroCanvas" ref={canvasRef}></canvas>;
}