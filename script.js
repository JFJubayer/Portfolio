/* ----------------------------------------------------
   HUMAN-CENTRIC STORYTELLING PORTFOLIO SCRIPTS
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------
     1. INTERACTIVE LOGIC CIRCUIT CONSTELLATION NET
     ---------------------------------------------------- */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    });

    let particles = [];
    const particleColor = 'rgba(217, 119, 6, 0.4)';
    let mouse = { x: null, y: null, radius: 160 };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class NetworkNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        const isLight = !document.body.classList.contains('dark-theme');
        ctx.fillStyle = isLight ? 'rgba(180, 83, 9, 0.45)' : 'rgba(217, 119, 6, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = isLight ? 'rgba(180, 83, 9, 0.18)' : 'rgba(217, 119, 6, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function initParticles() {
      particles = [];
      const densityCount = Math.min(Math.floor((width * height) / 9000), 100);
      for (let i = 0; i < densityCount; i++) {
        particles.push(new NetworkNode());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      const isLight = !document.body.classList.contains('dark-theme');

      // Draw background schematic grid
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.018)' : 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isLight 
              ? `rgba(180, 83, 9, ${0.28 * (1 - dist / 110)})` 
              : `rgba(217, 119, 6, ${0.25 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        particles.forEach(p => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius - 20) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isLight
              ? `rgba(180, 83, 9, ${0.15 * (1 - dist / mouse.radius)})`
              : `rgba(217, 119, 6, ${0.12 * (1 - dist / mouse.radius)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        });
      }

      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }


  /* ----------------------------------------------------
     2. INTERACTIVE HDL WAVEFORM SIMULATION WIDGET
     ---------------------------------------------------- */
  const simCodes = {
    counter: `// Hades-V Program Counter Core\nalways @(posedge clk or negedge rst_n) begin\n  if (!rst_n) \n    count <= 8'h00;\n  else \n    count <= count + 1'b1;\nend`,
    spi: `// SPI Transmitter Data Shifter\nalways @(posedge clk) begin\n  if (state == SEND && sck_pulse) begin\n    mosi   <= tx_reg[7];\n    tx_reg <= {tx_reg[6:0], 1'b0};\n  end\nend`,
    alu: `// Arithmetic Logic Unit Combinational\nalways @(*) begin\n  case (alu_op)\n    ADD: {carry, sum} = op_a + op_b;\n    SUB: {carry, sum} = op_a - op_b;\n    default: {carry, sum} = 9'h000;\n  endcase\nend`
  };

  const waveCanvas = document.getElementById('waveform-canvas');
  if (waveCanvas) {
    const wCtx = waveCanvas.getContext('2d');
    let wWidth = waveCanvas.width = waveCanvas.offsetWidth;
    let wHeight = waveCanvas.height = waveCanvas.offsetHeight;
    
    window.addEventListener('resize', () => {
      if (waveCanvas) {
        wWidth = waveCanvas.width = waveCanvas.offsetWidth;
        wHeight = waveCanvas.height = waveCanvas.offsetHeight;
      }
    });
    
    let history = [];
    const maxHistory = 150;
    let activeSim = 'counter';
    let isSimulating = true;
    let clockTicks = 0;
    
    let counterVal = 0;
    let spiState = 0;
    let mosiVal = 0;
    let spiBitsSent = 0;
    let txReg = 0xA5;
    let aluA = 4;
    let aluB = 2;
    let aluSum = 6;
    let aluOp = 0;
    
    const simBtns = document.querySelectorAll('.sim-tab-btn');
    const codeContainer = document.getElementById('sim-code');
    
    if (codeContainer) {
      codeContainer.textContent = simCodes.counter;
    }
    
    simBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        simBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeSim = btn.getAttribute('data-sim');
        if (codeContainer) {
          codeContainer.textContent = simCodes[activeSim];
        }
        history = [];
        clockTicks = 0;
      });
    });
    
    const btnRunSim = document.getElementById('btn-run-sim');
    const simLed = document.getElementById('sim-led');
    const simStatusText = document.getElementById('sim-status-text');
    
    if (btnRunSim) {
      btnRunSim.addEventListener('click', () => {
        isSimulating = !isSimulating;
        if (isSimulating) {
          btnRunSim.innerHTML = '<i class="fa-solid fa-pause"></i> PAUSE SIM';
          if (simLed) {
            simLed.className = 'led-dot running';
          }
          if (simStatusText) {
            simStatusText.textContent = 'SYS_RUNNING';
            simStatusText.style.color = '#10b981';
          }
        } else {
          btnRunSim.innerHTML = '<i class="fa-solid fa-play"></i> RUN SIMULATION';
          if (simLed) {
            simLed.className = 'led-dot active';
          }
          if (simStatusText) {
            simStatusText.textContent = 'SYS_PAUSED';
            simStatusText.style.color = '#ef4444';
          }
        }
      });
    }
    
    function simulateTick() {
      if (!isSimulating) return;
      
      clockTicks++;
      
      let clk = (clockTicks % 12 < 6) ? 1 : 0;
      let rst_n = (clockTicks < 35) ? 0 : 1;
      
      let sample = { clk, rst_n };
      
      if (activeSim === 'counter') {
        if (!rst_n) {
          counterVal = 0;
        } else if (clockTicks % 12 === 6) {
          counterVal = (counterVal + 1) % 256;
        }
        sample.val1 = counterVal;
      } else if (activeSim === 'spi') {
        if (clockTicks % 40 === 0) {
          spiState = (spiState === 0) ? 1 : 0;
          if (spiState === 1) {
            txReg = Math.floor(Math.random() * 256);
            spiBitsSent = 0;
          }
        }
        
        let sck = 0;
        if (spiState === 1) {
          sck = clk;
          if (clockTicks % 12 === 6) {
            mosiVal = (txReg >> (7 - spiBitsSent)) & 1;
            spiBitsSent = (spiBitsSent + 1) % 8;
          }
        } else {
          mosiVal = 0;
        }
        
        sample.val1 = sck;
        sample.val2 = mosiVal;
        sample.val3 = spiState;
      } else if (activeSim === 'alu') {
        if (clockTicks % 25 === 0) {
          aluA = Math.floor(Math.random() * 8) + 1;
          aluB = Math.floor(Math.random() * 8) + 1;
          aluOp = Math.random() > 0.5 ? 1 : 0;
          if (aluOp === 0) {
            aluSum = aluA + aluB;
          } else {
            aluSum = Math.max(0, aluA - aluB);
          }
        }
        sample.val1 = aluA;
        sample.val2 = aluB;
        sample.val3 = aluOp;
        sample.val4 = aluSum;
      }
      
      history.push(sample);
      if (history.length > maxHistory) {
        history.shift();
      }
    }
    
    function drawSimulation() {
      wCtx.clearRect(0, 0, wWidth, wHeight);
      const isLight = !document.body.classList.contains('dark-theme');
      
      wCtx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)';
      wCtx.lineWidth = 1;
      const step = 25;
      for (let i = step; i < wWidth; i += step) {
        wCtx.beginPath();
        wCtx.moveTo(i, 0);
        wCtx.lineTo(i, wHeight);
        wCtx.stroke();
      }
      
      wCtx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)';
      wCtx.beginPath();
      wCtx.moveTo(0, 45); wCtx.lineTo(wWidth, 45);
      wCtx.moveTo(0, 90); wCtx.lineTo(wWidth, 90);
      wCtx.moveTo(0, 135); wCtx.lineTo(wWidth, 135);
      wCtx.stroke();
      
      let signals = [];
      if (activeSim === 'counter') {
        signals = [
          { name: 'clk', type: 'bit', key: 'clk', y: 25 },
          { name: 'rst_n', type: 'bit', key: 'rst_n', y: 70 },
          { name: 'count[7:0]', type: 'bus', key: 'val1', y: 115 }
        ];
      } else if (activeSim === 'spi') {
        signals = [
          { name: 'clk', type: 'bit', key: 'clk', y: 25 },
          { name: 'sck', type: 'bit', key: 'val1', y: 65 },
          { name: 'mosi', type: 'bit', key: 'val2', y: 105 },
          { name: 'state', type: 'bit', key: 'val3', y: 145 }
        ];
      } else if (activeSim === 'alu') {
        signals = [
          { name: 'op_a[3:0]', type: 'bus', key: 'val1', y: 25 },
          { name: 'op_b[3:0]', type: 'bus', key: 'val2', y: 65 },
          { name: 'alu_op', type: 'bit', key: 'val3', y: 105 },
          { name: 'sum[4:0]', type: 'bus', key: 'val4', y: 145 }
        ];
      }
      
      wCtx.fillStyle = isLight ? 'rgba(237, 234, 224, 0.95)' : 'rgba(11, 12, 16, 0.9)';
      wCtx.fillRect(0, 0, 95, wHeight);
      wCtx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)';
      wCtx.beginPath();
      wCtx.moveTo(95, 0); wCtx.lineTo(95, wHeight);
      wCtx.stroke();
      
      wCtx.font = 'bold 9.5px "JetBrains Mono", monospace';
      wCtx.textAlign = 'left';
      signals.forEach(sig => {
        wCtx.fillStyle = isLight ? '#1c1d22' : '#f1f5f9';
        wCtx.fillText(sig.name, 10, sig.y + 4);
      });
      
      const startX = 100;
      const availableWidth = wWidth - startX;
      
      if (history.length > 0) {
        signals.forEach(sig => {
          wCtx.lineWidth = 1.6;
          
          if (sig.type === 'bit') {
            wCtx.strokeStyle = isLight ? '#b45309' : '#d97706';
            wCtx.beginPath();
            
            history.forEach((sample, idx) => {
              const xPos = startX + (idx / maxHistory) * availableWidth;
              const val = sample[sig.key] ? 1 : 0;
              const yPos = sig.y + (val === 1 ? -12 : 12);
              
              if (idx === 0) {
                wCtx.moveTo(xPos, yPos);
              } else {
                const prevVal = history[idx - 1][sig.key] ? 1 : 0;
                if (prevVal !== val) {
                  const prevX = startX + ((idx - 0.05) / maxHistory) * availableWidth;
                  wCtx.lineTo(xPos, sig.y + (prevVal === 1 ? -12 : 12));
                }
                wCtx.lineTo(xPos, yPos);
              }
            });
            wCtx.stroke();
          } else if (sig.type === 'bus') {
            wCtx.strokeStyle = isLight ? '#047857' : '#10b981';
            wCtx.fillStyle = isLight ? 'rgba(4, 120, 87, 0.04)' : 'rgba(16, 185, 129, 0.04)';
            
            history.forEach((sample, idx) => {
              if (idx === 0) return;
              
              const xPrev = startX + ((idx - 1) / maxHistory) * availableWidth;
              const xPos = startX + (idx / maxHistory) * availableWidth;
              const val = sample[sig.key] || 0;
              const prevVal = history[idx - 1][sig.key] || 0;
              
              const topY = sig.y - 10;
              const bottomY = sig.y + 10;
              
              if (val !== prevVal || idx === 1) {
                wCtx.beginPath();
                wCtx.moveTo(xPrev, sig.y);
                wCtx.lineTo(xPrev + 3, topY);
                wCtx.lineTo(xPos - 3, topY);
                wCtx.lineTo(xPos, sig.y);
                wCtx.lineTo(xPos - 3, bottomY);
                wCtx.lineTo(xPrev + 3, bottomY);
                wCtx.closePath();
                wCtx.stroke();
                wCtx.fill();
                
                if (xPos - xPrev > 28) {
                  wCtx.fillStyle = isLight ? '#1c1d22' : '#e2e8f0';
                  wCtx.font = '8px "JetBrains Mono", monospace';
                  wCtx.textAlign = 'center';
                  let hexVal = '0x' + val.toString(16).toUpperCase();
                  wCtx.fillText(hexVal, (xPrev + xPos) / 2, sig.y + 3);
                  wCtx.fillStyle = isLight ? 'rgba(4, 120, 87, 0.04)' : 'rgba(16, 185, 129, 0.04)';
                }
              } else {
                wCtx.beginPath();
                wCtx.moveTo(xPrev, topY); wCtx.lineTo(xPos, topY);
                wCtx.moveTo(xPrev, bottomY); wCtx.lineTo(xPos, bottomY);
                wCtx.stroke();
              }
            });
          }
        });
      }
      
      wCtx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255,255,255,0.06)';
      wCtx.strokeRect(0, 0, wWidth, wHeight);
    }
    
    for (let i = 0; i < 80; i++) {
      simulateTick();
    }
    setInterval(simulateTick, 60);
    
    function simAnimationLoop() {
      drawSimulation();
      requestAnimationFrame(simAnimationLoop);
    }
    
    simAnimationLoop();
  }


  /* ----------------------------------------------------
     3. INTERACTIVE 3D CAREER TREE SYSTEM (CANVAS ENGINE)
     ---------------------------------------------------- */
  const treeCanvas = document.getElementById('tree-canvas');
  const detailPanes = document.querySelectorAll('.path-detail-pane');

  if (treeCanvas) {
    const ctx = treeCanvas.getContext('2d');
    let width = treeCanvas.width = treeCanvas.offsetWidth;
    let height = treeCanvas.height = treeCanvas.offsetHeight;

    window.addEventListener('resize', () => {
      width = treeCanvas.width = treeCanvas.offsetWidth;
      height = treeCanvas.height = treeCanvas.offsetHeight;
    });

    // 3D Nodes Definition representing Jubaer's Trajectory Map
    const nodes = [
      { id: 'root', x: 0, y: -120, z: 0, label: 'MEC studies', path: 'root', size: 6 },
      { id: 'trunk', x: 0, y: -45, z: 0, label: '', path: 'root', size: 4 },
      // Primary Path (Scholarships)
      { id: 'path_a', x: -65, y: 15, z: -25, label: 'Scholarships', path: 'scholarship', size: 8 },
      { id: 'kth', x: -110, y: 65, z: -65, label: 'KTH Sweden', path: 'scholarship', size: 4 },
      { id: 'ntnu', x: -130, y: 110, z: -35, label: 'NTNU Norway', path: 'scholarship', size: 4 },
      { id: 'aalto', x: -95, y: 135, z: -85, label: 'Aalto Finland', path: 'scholarship', size: 4 },
      { id: 'dtu', x: -125, y: 95, z: -115, label: 'DTU Denmark', path: 'scholarship', size: 4 },
      { id: 'erasmus', x: -60, y: 140, z: -45, label: 'Erasmus Mundus', path: 'scholarship', size: 4 },
      { id: 'commonwealth', x: -40, y: 105, z: -15, label: 'Commonwealth', path: 'scholarship', size: 4 },
      { id: 'australia', x: -80, y: 165, z: -65, label: 'Australia Awards', path: 'scholarship', size: 4 },
      // Secondary Path (Military)
      { id: 'path_b', x: 65, y: 10, z: 35, label: 'Military Commissions', path: 'military', size: 8 },
      { id: 'bma', x: 110, y: 75, z: 55, label: 'BMA Captain', path: 'military', size: 4 },
      { id: 'jco', x: 90, y: 115, z: 25, label: 'JCO Officer', path: 'military', size: 4 },
      // Remote Hardware Consulting Path
      { id: 'path_c', x: 0, y: 25, z: 55, label: 'FPGA & RTL Consulting', path: 'consulting', size: 8 },
      { id: 'rtl_verif', x: 25, y: 105, z: 95, label: 'RTL Verification', path: 'consulting', size: 4 },
      { id: 'freelance', x: -30, y: 85, z: 80, label: 'Embedded Firmware', path: 'consulting', size: 4 },
      // BCS Cadre Path
      { id: 'path_d', x: -45, y: 10, z: 55, label: 'BCS Cadre', path: 'bcs_cadre', size: 8 },
      { id: 'bcs_general', x: -85, y: 65, z: 75, label: 'General Track', path: 'bcs_cadre', size: 4 },
      { id: 'bcs_tech', x: -60, y: 95, z: 95, label: 'Technical Track', path: 'bcs_cadre', size: 4 },
      { id: 'bcs_const', x: -110, y: 110, z: 55, label: 'Constitution & Lit', path: 'bcs_cadre', size: 4 },
      { id: 'bcs_written', x: -75, y: 145, z: 65, label: 'Written Drills', path: 'bcs_cadre', size: 4 },
      // BPSC Non-Cadre Path
      { id: 'path_e', x: 65, y: 20, z: -35, label: 'BPSC Non-Cadre', path: 'bpsc_non_cadre', size: 8 },
      { id: 'non_cadre_ap', x: 110, y: 70, z: -55, label: 'Assistant Programmer', path: 'bpsc_non_cadre', size: 4 },
      { id: 'non_cadre_ame', x: 130, y: 105, z: -25, label: 'Assistant Maint. Eng.', path: 'bpsc_non_cadre', size: 4 },
      { id: 'non_cadre_tech', x: 85, y: 130, z: -65, label: 'Dual-Zone Tech', path: 'bpsc_non_cadre', size: 4 },
      // Power & Telecom Path
      { id: 'path_f', x: 15, y: 30, z: -60, label: 'Power & Telecom', path: 'power_telecom', size: 8 },
      { id: 'power_net', x: 45, y: 80, z: -95, label: 'Data Comm & Networking', path: 'power_telecom', size: 4 },
      { id: 'power_db', x: -15, y: 115, z: -85, label: 'DBMS & OOP Logic', path: 'power_telecom', size: 4 },
      { id: 'power_ds', x: 25, y: 150, z: -75, label: 'Data Structures & Puzzles', path: 'power_telecom', size: 4 }
    ];

    // Branch connections links list
    const links = [
      { from: 'root', to: 'trunk' },
      { from: 'trunk', to: 'path_a' },
      { from: 'trunk', to: 'path_b' },
      { from: 'trunk', to: 'path_c' },
      { from: 'trunk', to: 'path_d' },
      { from: 'trunk', to: 'path_e' },
      { from: 'trunk', to: 'path_f' },
      { from: 'path_a', to: 'kth' },
      { from: 'path_a', to: 'ntnu' },
      { from: 'path_a', to: 'aalto' },
      { from: 'path_a', to: 'dtu' },
      { from: 'path_a', to: 'erasmus' },
      { from: 'path_a', to: 'commonwealth' },
      { from: 'path_a', to: 'australia' },
      { from: 'path_b', to: 'bma' },
      { from: 'path_b', to: 'jco' },
      { from: 'path_c', to: 'rtl_verif' },
      { from: 'path_c', to: 'freelance' },
      { from: 'path_d', to: 'bcs_general' },
      { from: 'path_d', to: 'bcs_tech' },
      { from: 'path_d', to: 'bcs_const' },
      { from: 'path_d', to: 'bcs_written' },
      { from: 'path_e', to: 'non_cadre_ap' },
      { from: 'path_e', to: 'non_cadre_ame' },
      { from: 'path_e', to: 'non_cadre_tech' },
      { from: 'path_f', to: 'power_net' },
      { from: 'path_f', to: 'power_db' },
      { from: 'path_f', to: 'power_ds' }
    ];

    let angleX = -0.25;  // Slight pitch down
    let angleY = 0.5;    // Slow initial rotation angle
    let targetAngleX = -0.25;
    let targetAngleY = 0.5;

    let isDragging = false;
    let draggedDistance = 0;
    let previousMousePosition = { x: 0, y: 0 };
    let activePath = 'scholarship';
    let hoveredNode = null;

    // Mouse tilt interactions
    treeCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      draggedDistance = 0;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    treeCanvas.addEventListener('mousemove', (e) => {
      const rect = treeCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        draggedDistance += Math.hypot(deltaX, deltaY);

        targetAngleY += deltaX * 0.007;
        targetAngleX += deltaY * 0.007;

        // Clamp X tilt to prevent flipping
        targetAngleX = Math.max(-0.8, Math.min(0.2, targetAngleX));
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Check collision/hover coordinates
      let foundHover = null;
      let minDistance = 15; // px trigger radius

      nodes.forEach(node => {
        if (node.projX && node.projY) {
          const dist = Math.hypot(node.projX - mouseX, node.projY - mouseY);
          if (dist < minDistance) {
            foundHover = node;
            minDistance = dist;
          }
        }
      });

      hoveredNode = foundHover;
      if (hoveredNode && hoveredNode.path !== 'root') {
        treeCanvas.style.cursor = 'pointer';
      } else {
        treeCanvas.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    });

    // Touch screen support
    treeCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        draggedDistance = 0;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    treeCanvas.addEventListener('touchend', () => {
      isDragging = false;
    });

    treeCanvas.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        draggedDistance += Math.hypot(deltaX, deltaY);

        targetAngleY += deltaX * 0.008;
        targetAngleX += deltaY * 0.008;

        targetAngleX = Math.max(-0.8, Math.min(0.2, targetAngleX));
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    // Click/tap interaction to select node details
    treeCanvas.addEventListener('click', (e) => {
      if (draggedDistance > 12) return; // Skip selection if user was rotating the tree

      const rect = treeCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundClicked = null;
      let minDistance = 20; // px click tolerance radius

      nodes.forEach(node => {
        if (node.projX && node.projY) {
          const dist = Math.hypot(node.projX - mouseX, node.projY - mouseY);
          if (dist < minDistance) {
            foundClicked = node;
            minDistance = dist;
          }
        }
      });

      if (foundClicked && foundClicked.path !== 'root') {
        if (foundClicked.path !== activePath) {
          triggerPathChange(foundClicked.path);
        }
      }
    });

    function triggerPathChange(pathName) {
      activePath = pathName;
      detailPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `path-pane-${pathName}`) {
          pane.classList.add('active');
          const bar = pane.querySelector('.relevance-bar');
          if (bar) {
            const targetWidth = bar.getAttribute('data-relevance') || '0%';
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = targetWidth;
            }, 50);
          }
        }
      });

      // Update active timeline checklist
      const timelines = document.querySelectorAll('.roadmap-timeline');
      timelines.forEach(timeline => {
        timeline.classList.remove('active');
        if (timeline.id === `timeline-${pathName}`) {
          timeline.classList.add('active');
        }
      });

      // Sync quick-select track buttons
      const trackBtns = document.querySelectorAll('.roadmap-track-btn');
      trackBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-path') === pathName);
      });
    }

    // Bind quick-select track pill clicks
    const roadmapTrackBtns = document.querySelectorAll('.roadmap-track-btn');
    roadmapTrackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedPath = btn.getAttribute('data-path');
        if (selectedPath && selectedPath !== activePath) {
          triggerPathChange(selectedPath);
        }
      });
    });

    // Dynamic 3D Renderer loop
    function renderTree() {
      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation of angles
      angleX += (targetAngleX - angleX) * 0.1;
      angleY += (targetAngleY - angleY) * 0.1;

      // Slowly rotate tree automatically when not dragging
      if (!isDragging) {
        targetAngleY += 0.0025;
      }

      const cx = width * 0.5;
      const cy = height * 0.38; // Adjusted center for larger scale downward tree
      const dist = 380;       // Perspective distance parameter

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Track-specific cyber neon colors
      const pathColors = {
        scholarship: '#38bdf8',       // Cyber Blue
        military: '#10b981',          // Emerald Green
        consulting: '#fbbf24',        // Amber Gold
        bcs_cadre: '#a855f7',         // Royal Purple
        bpsc_non_cadre: '#ec4899',    // Rose Pink
        power_telecom: '#06b6d4',     // Telecom Cyan
        root: '#d97706'               // Trunk/Root color
      };

      // 1. Calculate 3D rotated & projected coordinates for all nodes
      const coordScale = 1.8; // Make the tree 1.8x larger to fill the rectangle box
      nodes.forEach(node => {
        // Rotate around Y-axis
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;

        // Rotate around X-axis
        const y1 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        // Perspective projection formula
        const scale = dist / (dist + z2);
        node.projX = cx + x1 * scale * coordScale;
        node.projY = cy + y1 * scale * coordScale;
        node.depth = z2; // save depth for painter rendering order if needed
      });

      // 2. Draw Branch Vectors
      links.forEach(link => {
        const fromNode = nodes.find(n => n.id === link.from);
        const toNode = nodes.find(n => n.id === link.to);

        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.projX, fromNode.projY);
          ctx.lineTo(toNode.projX, toNode.projY);

          // Color paths based on active/hovered branch category
          const isLimbActive = (toNode.path === activePath && toNode.path !== 'root');
          const isLimbHovered = (hoveredNode && toNode.path === hoveredNode.path && toNode.path !== 'root');
          const isThemeLight = !document.body.classList.contains('dark-theme');
          const pathColor = pathColors[toNode.path] || '#d97706';

          if (isLimbActive || isLimbHovered) {
            ctx.strokeStyle = pathColor;
            ctx.lineWidth = toNode.id.startsWith('path_') ? 3.5 : 2.2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = pathColor;
          } else {
            ctx.strokeStyle = isThemeLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
            ctx.lineWidth = toNode.id.startsWith('path_') ? 2 : 1;
            ctx.shadowBlur = 0;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      // 3. Draw Nodes
      nodes.forEach(node => {
        const isNodeActive = (node.path === activePath && node.path !== 'root') || (node.id === 'root');
        const isNodeHovered = (hoveredNode && node.id === hoveredNode.id);
        const isNodeLimbHovered = (hoveredNode && node.path === hoveredNode.path && node.path !== 'root');
        const isThemeLight = !document.body.classList.contains('dark-theme');
        const pathColor = pathColors[node.path] || '#d97706';

        ctx.beginPath();
        ctx.arc(node.projX, node.projY, node.size + (isNodeHovered ? 2.5 : 0), 0, Math.PI * 2);

        if (isNodeHovered) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = pathColor;
          ctx.shadowBlur = 12;
        } else if (isNodeActive || isNodeLimbHovered) {
          ctx.fillStyle = pathColor;
          ctx.shadowColor = pathColor;
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = isThemeLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // 4. Render Text Labels next to nodes
        const isMajor = node.id === 'root' || node.id.startsWith('path_');
        
        if (isMajor || isNodeActive || isNodeLimbHovered) {
          ctx.font = isMajor ? 'bold 10px "Plus Jakarta Sans", sans-serif' : '500 8.5px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';

          if (isNodeHovered) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = pathColor;
            ctx.shadowBlur = 4;
          } else if (isNodeActive || isNodeLimbHovered) {
            ctx.fillStyle = pathColor;
          } else {
            ctx.fillStyle = isThemeLight ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.45)';
          }

          // Offset text slightly above nodes
          ctx.fillText(node.label, node.projX, node.projY - 12);
        }
      });

      requestAnimationFrame(renderTree);
    }

    renderTree();
  }


  /* ----------------------------------------------------
     PROJECT MINIATURES ANIMATION CONTROLLER
     ---------------------------------------------------- */
  function initProjectCanvases() {
    const canvasHades = document.getElementById('project-canvas-hades');
    const canvasRobot = document.getElementById('project-canvas-robot');
    const canvasFace = document.getElementById('project-canvas-face');
    const canvasHealth = document.getElementById('project-canvas-health');

    // Hadi-V / Swadheen-SoC block diagram
    const canvasSoc = document.getElementById('project-canvas-soc');
    if (canvasSoc) {
      const ctx = canvasSoc.getContext('2d');
      let w = canvasSoc.width = canvasSoc.offsetWidth || 300;
      let h = canvasSoc.height = canvasSoc.offsetHeight || 180;

      window.addEventListener('resize', () => {
        w = canvasSoc.width = canvasSoc.offsetWidth || 300;
        h = canvasSoc.height = canvasSoc.offsetHeight || 180;
      });

      const peripherals = ['UART', 'GPIO', 'SPI', 'I2C'];
      let tick = 0;
      function drawSoc() {
        if (!canvasSoc.offsetParent) {
          requestAnimationFrame(drawSoc);
          return;
        }
        ctx.clearRect(0, 0, w, h);
        tick++;

        const busY = h / 2 + 6;
        const cpuW = 76;
        const cpuX = w / 2 - cpuW / 2;

        ctx.lineWidth = 1;
        ctx.textAlign = 'center';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';

        ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)';
        ctx.strokeRect(cpuX, 26, cpuW, 30);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.fillText('HADI-V', w / 2, 45);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.beginPath();
        ctx.moveTo(w / 2, 56);
        ctx.lineTo(w / 2, busY);
        ctx.moveTo(24, busY);
        ctx.lineTo(w - 24, busY);
        ctx.stroke();

        const active = Math.floor(tick / 70) % peripherals.length;
        peripherals.forEach((name, idx) => {
          const x = 24 + ((idx + 0.5) / peripherals.length) * (w - 48);
          ctx.strokeStyle = idx === active ? 'rgba(16, 185, 129, 0.7)' : 'rgba(255, 255, 255, 0.12)';
          ctx.beginPath();
          ctx.moveTo(x, busY);
          ctx.lineTo(x, busY + 18);
          ctx.stroke();
          ctx.strokeRect(x - 24, busY + 18, 48, 24);
          ctx.fillStyle = idx === active ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.35)';
          ctx.font = 'bold 8px "JetBrains Mono", monospace';
          ctx.fillText(name, x, busY + 33);
        });

        const targetX = 24 + ((active + 0.5) / peripherals.length) * (w - 48);
        const t = (tick % 70) / 70;
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(w / 2 + (targetX - w / 2) * t, busY, 2.2, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(drawSoc);
      }
      drawSoc();
    }

    // Hades-V Loop
    if (canvasHades) {
      const ctx = canvasHades.getContext('2d');
      let w = canvasHades.width = canvasHades.offsetWidth || 300;
      let h = canvasHades.height = canvasHades.offsetHeight || 180;
      
      window.addEventListener('resize', () => {
        if (canvasHades) {
          w = canvasHades.width = canvasHades.offsetWidth || 300;
          h = canvasHades.height = canvasHades.offsetHeight || 180;
        }
      });
      
      let tick = 0;
      function drawHades() {
        if (!canvasHades.offsetParent) {
          requestAnimationFrame(drawHades);
          return;
        }
        ctx.clearRect(0, 0, w, h);
        tick++;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.strokeRect(20, 20, w - 40, h - 40);

        const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
        stages.forEach((st, idx) => {
          const x = 30 + (idx / 4) * (w - 92);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.strokeRect(x, 60, 28, 36);
          ctx.fillStyle = 'rgba(255,255,255,0.01)';
          ctx.fillRect(x, 60, 28, 36);
          
          ctx.font = 'bold 8px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.textAlign = 'center';
          ctx.fillText(st, x + 14, 80);

          const pulseX = x + 14 + Math.sin(tick * 0.04 + idx) * 10;
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(pulseX, 86, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.beginPath();
        for (let x = 20; x < w - 20; x++) {
          const y = h - 30 + Math.sin(x * 0.08 + tick * 0.1) * 6;
          if (x === 20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        requestAnimationFrame(drawHades);
      }
      drawHades();
    }

    // Robot Loop
    if (canvasRobot) {
      const ctx = canvasRobot.getContext('2d');
      let w = canvasRobot.width = canvasRobot.offsetWidth || 300;
      let h = canvasRobot.height = canvasRobot.offsetHeight || 180;
      
      window.addEventListener('resize', () => {
        if (canvasRobot) {
          w = canvasRobot.width = canvasRobot.offsetWidth || 300;
          h = canvasRobot.height = canvasRobot.offsetHeight || 180;
        }
      });
      
      let tick = 0;
      function drawRobot() {
        if (!canvasRobot.offsetParent) {
          requestAnimationFrame(drawRobot);
          return;
        }
        ctx.clearRect(0, 0, w, h);
        tick++;

        const cx = w / 2;
        const cy = h / 2;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let r = 20; r < 70; r += 20) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        const angle = (tick * 0.02) % (Math.PI * 2);
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 70, cy + Math.sin(angle) * 70);
        ctx.stroke();

        const sensorPoints = [];
        for (let i = -3; i <= 3; i++) {
          sensorPoints.push({
            x: cx + i * 16,
            y: cy + 30 + Math.sin(tick * 0.08 + i) * 3
          });
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        sensorPoints.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        sensorPoints.forEach((p, idx) => {
          ctx.fillStyle = idx === 3 ? '#d97706' : 'rgba(255,255,255,0.25)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, idx === 3 ? 3.5 : 2, 0, Math.PI * 2);
          ctx.fill();
        });

        requestAnimationFrame(drawRobot);
      }
      drawRobot();
    }

    // Face Loop
    if (canvasFace) {
      const ctx = canvasFace.getContext('2d');
      let w = canvasFace.width = canvasFace.offsetWidth || 300;
      let h = canvasFace.height = canvasFace.offsetHeight || 180;
      
      window.addEventListener('resize', () => {
        if (canvasFace) {
          w = canvasFace.width = canvasFace.offsetWidth || 300;
          h = canvasFace.height = canvasFace.offsetHeight || 180;
        }
      });
      
      let tick = 0;
      const points = [];
      const numPoints = 12;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        points.push({
          angle,
          baseR: 28 + Math.random() * 8
        });
      }

      function drawFace() {
        if (!canvasFace.offsetParent) {
          requestAnimationFrame(drawFace);
          return;
        }
        ctx.clearRect(0, 0, w, h);
        tick++;

        const cx = w / 2;
        const cy = h / 2;

        ctx.strokeStyle = 'rgba(217, 119, 6, 0.16)';
        ctx.lineWidth = 0.8;
        
        ctx.beginPath();
        points.forEach((p, idx) => {
          const r = p.baseR + Math.sin(tick * 0.05 + idx) * 3;
          const px = cx + Math.cos(p.angle) * r;
          const py = cy + Math.sin(p.angle) * r;
          p.x = px;
          p.y = py;
          
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        points.forEach((p, idx) => {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          
          ctx.fillStyle = idx % 3 === 0 ? '#d97706' : 'rgba(255,255,255,0.2)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        const scanY = cy + Math.sin(tick * 0.03) * 40;
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 45, scanY);
        ctx.lineTo(cx + 45, scanY);
        ctx.stroke();

        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.textAlign = 'center';
        ctx.fillText("AI_FACE_SCAN: 99.2%", cx, cy + 50);

        requestAnimationFrame(drawFace);
      }
      drawFace();
    }

    // Health App Loop
    if (canvasHealth) {
      const ctx = canvasHealth.getContext('2d');
      let w = canvasHealth.width = canvasHealth.offsetWidth || 300;
      let h = canvasHealth.height = canvasHealth.offsetHeight || 180;
      
      window.addEventListener('resize', () => {
        if (canvasHealth) {
          w = canvasHealth.width = canvasHealth.offsetWidth || 300;
          h = canvasHealth.height = canvasHealth.offsetHeight || 180;
        }
      });
      
      let tick = 0;
      function drawHealth() {
        if (!canvasHealth.offsetParent) {
          requestAnimationFrame(drawHealth);
          return;
        }
        ctx.clearRect(0, 0, w, h);
        tick++;

        const cx = w / 2;
        const cy = h / 2;

        const progressList = [
          { r: 22, color: '#ef4444', pct: 0.72 + Math.sin(tick * 0.02) * 0.05 },
          { r: 32, color: '#fbbf24', pct: 0.65 },
          { r: 42, color: '#10b981', pct: 0.88 + Math.cos(tick * 0.01) * 0.03 }
        ];

        progressList.forEach(ring => {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = ring.color;
          ctx.lineWidth = 4.8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(cx, cy, ring.r, -Math.PI / 2, -Math.PI / 2 + ring.pct * Math.PI * 2);
          ctx.stroke();
        });

        ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText("NUTRITION", cx, cy - 2);
        ctx.font = '7px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText("SYNCING", cx, cy + 8);

        requestAnimationFrame(drawHealth);
      }
      drawHealth();
    }

    // CorridorShare Loop
    const canvasCorridor = document.getElementById('project-canvas-corridor');
    if (canvasCorridor) {
      const ctx = canvasCorridor.getContext('2d');
      let w = canvasCorridor.width = canvasCorridor.offsetWidth || 300;
      let h = canvasCorridor.height = canvasCorridor.offsetHeight || 180;

      window.addEventListener('resize', () => {
        if (canvasCorridor) {
          w = canvasCorridor.width = canvasCorridor.offsetWidth || 300;
          h = canvasCorridor.height = canvasCorridor.offsetHeight || 180;
        }
      });

      let tick = 0;
      function drawCorridor() {
        if (!canvasCorridor.offsetParent) {
          requestAnimationFrame(drawCorridor);
          return;
        }
        ctx.clearRect(0, 0, w, h);
        tick++;

        const cy = h / 2;

        // Draw background grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 0.5;
        for (let i = 20; i < w; i += 20) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
        }
        for (let i = 20; i < h; i += 20) {
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
        }

        // Draw Highway Route
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(30, cy + 20);
        ctx.bezierCurveTo(w / 3, cy - 30, (2 * w) / 3, cy + 30, w - 30, cy - 20);
        ctx.stroke();

        // Dashed center line
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(30, cy + 20);
        ctx.bezierCurveTo(w / 3, cy - 30, (2 * w) / 3, cy + 30, w - 30, cy - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Calculate traveler dot position
        const t = (tick * 0.005) % 1.0;
        const p0 = { x: 30, y: cy + 20 };
        const p1 = { x: w / 3, y: cy - 30 };
        const p2 = { x: (2 * w) / 3, y: cy + 30 };
        const p3 = { x: w - 30, y: cy - 20 };

        const cx_pos = (1-t)*(1-t)*(1-t)*p0.x + 3*(1-t)*(1-t)*t*p1.x + 3*(1-t)*t*t*p2.x + t*t*t*p3.x;
        const cy_pos = (1-t)*(1-t)*(1-t)*p0.y + 3*(1-t)*(1-t)*t*p1.y + 3*(1-t)*t*t*p2.y + t*t*t*p3.y;

        // Draw Geofence Radar Pulse
        const radarRadius = 25 + Math.sin(tick * 0.08) * 8;
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.25)';
        ctx.fillStyle = 'rgba(249, 115, 22, 0.02)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx_pos, cy_pos, radarRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw Package pickup nodes nearby
        const packages = [
          { x: w / 2 - 10, y: cy - 20, active: true },
          { x: w / 3 + 20, y: cy + 25, active: false }
        ];

        packages.forEach(pkg => {
          ctx.fillStyle = pkg.active ? '#f97316' : 'rgba(255,255,255,0.2)';
          ctx.beginPath();
          ctx.arc(pkg.x, pkg.y, pkg.active ? 3 : 2, 0, Math.PI * 2);
          ctx.fill();

          if (pkg.active) {
            ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(cx_pos, cy_pos);
            ctx.lineTo(pkg.x, pkg.y);
            ctx.stroke();
          }
        });

        // Draw traveler dot
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(cx_pos, cy_pos, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Text indicators
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.textAlign = 'left';
        ctx.fillText("RADAR: SCANNING", 20, 25);
        ctx.fillStyle = '#f97316';
        ctx.fillText("P2P CORRIDOR", 20, 35);

        requestAnimationFrame(drawCorridor);
      }
      drawCorridor();
    }

    // Onnoy Loop
    const canvasOnnoy = document.getElementById('project-canvas-onnoy');
    if (canvasOnnoy) {
      const ctx = canvasOnnoy.getContext('2d');
      let w = canvasOnnoy.width = canvasOnnoy.offsetWidth || 300;
      let h = canvasOnnoy.height = canvasOnnoy.offsetHeight || 180;

      window.addEventListener('resize', () => {
        if (canvasOnnoy) {
          w = canvasOnnoy.width = canvasOnnoy.offsetWidth || 300;
          h = canvasOnnoy.height = canvasOnnoy.offsetHeight || 180;
        }
      });

      let tick = 0;
      const nodes = [
        { x: 60, y: 50, vx: 0.1, vy: 0.15, size: 3 },
        { x: 120, y: 120, vx: -0.15, vy: 0.1, size: 4 },
        { x: 180, y: 60, vx: 0.2, vy: -0.1, size: 3 },
        { x: 240, y: 110, vx: -0.1, vy: -0.15, size: 5 },
        { x: 150, y: 80, vx: 0.08, vy: 0.08, size: 4.5 }
      ];

      function drawOnnoy() {
        if (!canvasOnnoy.offsetParent) {
          requestAnimationFrame(drawOnnoy);
          return;
        }
        ctx.clearRect(0, 0, w, h);
        tick++;

        // Draw scanning wave circle
        const cx = w / 2;
        const cy = h / 2;
        const waveRadius = (tick * 0.8) % (w / 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - waveRadius / (w / 2)) * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Update and draw nodes
        nodes.forEach(node => {
          node.x += node.vx;
          node.y += node.vy;

          const margin = 20;
          if (node.x < margin || node.x > w - margin) node.vx *= -1;
          if (node.y < margin || node.y > h - margin) node.vy *= -1;

          node.x = Math.max(margin, Math.min(w - margin, node.x));
          node.y = Math.max(margin, Math.min(h - margin, node.y));
        });

        // Draw connections
        ctx.lineWidth = 0.8;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (dist < 100) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 100) * 0.15})`;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        nodes.forEach(node => {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + Math.sin(tick * 0.05 + node.size) * 0.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 4, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Text HUD
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.textAlign = 'left';
        ctx.fillText("SECURE_NET: ONLINE", 20, 25);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText("DIGITAL CITIZENSHIP", 20, 35);

        requestAnimationFrame(drawOnnoy);
      }
      drawOnnoy();
    }

    // Digital Museum Loop
    const canvasMuseum = document.getElementById('project-canvas-museum');
    if (canvasMuseum) {
      const ctx = canvasMuseum.getContext('2d');
      let w = canvasMuseum.width = canvasMuseum.offsetWidth || 300;
      let h = canvasMuseum.height = canvasMuseum.offsetHeight || 180;

      window.addEventListener('resize', () => {
        if (canvasMuseum) {
          w = canvasMuseum.width = canvasMuseum.offsetWidth || 300;
          h = canvasMuseum.height = canvasMuseum.offsetHeight || 180;
        }
      });

      let tick = 0;
      // Saffron, terracotta and green: the Digital Museum palette
      const weave = ['240, 169, 59', '201, 74, 45', '46, 148, 104'];

      function drawMuseum() {
        if (!canvasMuseum.offsetParent) {
          requestAnimationFrame(drawMuseum);
          return;
        }
        ctx.clearRect(0, 0, w, h);
        tick++;

        const cx = w / 2;
        const half = Math.min(105, w / 2 - 28);
        const left = cx - half;
        const right = cx + half;
        const floorY = h - 36;
        const beamY = 76;

        // Steps
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.strokeRect(left - 6 - i * 7, floorY + i * 5, (half + 6 + i * 7) * 2, 5);
        }

        // Columns
        const cols = 5;
        for (let i = 0; i < cols; i++) {
          const x = left + (i / (cols - 1)) * (right - left) - 4.5;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
          ctx.fillRect(x, beamY, 9, floorY - beamY);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
          ctx.strokeRect(x, beamY, 9, floorY - beamY);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.beginPath();
          ctx.moveTo(x + 4.5, beamY + 4);
          ctx.lineTo(x + 4.5, floorY - 4);
          ctx.stroke();
        }

        // Beam and pediment
        ctx.strokeStyle = 'rgba(240, 169, 59, 0.45)';
        ctx.strokeRect(left - 10, beamY - 9, (right - left) + 20, 9);
        ctx.fillStyle = 'rgba(240, 169, 59, 0.04)';
        ctx.beginPath();
        ctx.moveTo(left - 14, beamY - 9);
        ctx.lineTo(cx, 30);
        ctx.lineTo(right + 14, beamY - 9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Woven diamond band along the beam
        let n = 0;
        for (let x = left - 4; x <= right + 4; x += 10, n++) {
          const alpha = 0.3 + 0.4 * Math.abs(Math.sin(tick * 0.04 + n * 0.6));
          ctx.fillStyle = `rgba(${weave[n % 3]}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(x, beamY - 7);
          ctx.lineTo(x + 3, beamY - 4.5);
          ctx.lineTo(x, beamY - 2);
          ctx.lineTo(x - 3, beamY - 4.5);
          ctx.closePath();
          ctx.fill();
        }

        // Consent beacon in the pediment
        const pulse = 0.5 + 0.5 * Math.sin(tick * 0.05);
        ctx.strokeStyle = `rgba(240, 169, 59, ${0.3 + pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(cx, 54, 6 + pulse * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#f0a93b';
        ctx.beginPath();
        ctx.arc(cx, 54, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Visitor walking along the portico
        const visitorX = left + ((tick * 0.5) % (right - left));
        ctx.fillStyle = '#2e9468';
        ctx.beginPath();
        ctx.arc(visitorX, floorY - 7, 2.6, 0, Math.PI * 2);
        ctx.fill();

        // Text HUD
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.textAlign = 'left';
        ctx.fillText("CONSENT: REQUIRED", 20, 25);
        ctx.fillStyle = '#f0a93b';
        ctx.fillText("DIGITAL MUSEUM", 20, 35);

        requestAnimationFrame(drawMuseum);
      }
      drawMuseum();
    }
  }

  initProjectCanvases();


  /* ----------------------------------------------------
     4. INTERACTIVE TIMELINE ROADMAP CHECKBOXES
     ---------------------------------------------------- */
  const goalCheckboxes = document.querySelectorAll('.goal-item input[type="checkbox"]');
  
  goalCheckboxes.forEach(checkbox => {
    const parentGoal = checkbox.closest('.goal-item');
    if (parentGoal && checkbox.checked) {
      parentGoal.classList.add('completed');
    }

    checkbox.addEventListener('change', () => {
      const parent = checkbox.closest('.goal-item');
      if (parent) {
        if (checkbox.checked) {
          parent.classList.add('completed');
        } else {
          parent.classList.remove('completed');
        }
      }
    });
  });


  /* ----------------------------------------------------
     5. TYPEWRITER EFFECT
     ---------------------------------------------------- */
  const words = ["FPGA & RTL Engineer", "Embedded Hardware Designer", "RISC-V Processor Architect", "ROS 2 Robotics Integrator", "Andes Hackathon 2nd Place"];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typewriterElement = document.getElementById('typewriter');
  let typingSpeed = 100;

  function handleTypewriter() {
    if (!typewriterElement) return;
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(handleTypewriter, typingSpeed);
  }

  if (typewriterElement) {
    setTimeout(handleTypewriter, 1000);
  }


  /* ----------------------------------------------------
     6. MOBILE HAMBURGER TOGGLE MENU
     ---------------------------------------------------- */
  const burger = document.querySelector('.burger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('toggle');
      mobileNav.classList.toggle('active');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('toggle');
        mobileNav.classList.remove('active');
      });
    });
  }


  /* ----------------------------------------------------
     7. HEADER SCROLL & FAB BUTTON TRANSITIONS
     ---------------------------------------------------- */
  const header = document.getElementById('header');
  const fabCv = document.getElementById('fabCv');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (fabCv) {
      if (window.scrollY > 300) {
        fabCv.classList.add('visible');
      } else {
        fabCv.classList.remove('visible');
      }
    }
  });


  /* ----------------------------------------------------
     8. SCROLL REVEAL INTERSECTION OBSERVER
     ---------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  const skillProgressBars = document.querySelectorAll('.skill-progress');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        if (entry.target.id === 'skills' || entry.target.classList.contains('skill-card') || entry.target.classList.contains('skills-cards-column')) {
          animateSkillBars();
        }

        if (entry.target.classList.contains('trajectory-board')) {
          const activeRelBar = entry.target.querySelector('.path-detail-pane.active .relevance-bar');
          if (activeRelBar) {
            activeRelBar.style.width = activeRelBar.getAttribute('data-relevance') || '85%';
          }
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  function animateSkillBars() {
    skillProgressBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = targetWidth;
    });
  }


  /* ----------------------------------------------------
     9. SCROLL SPY - HIGHLIGHT ACTIVE NAVIGATION LINK
     ---------------------------------------------------- */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 180) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });


  /* ----------------------------------------------------
     3D CARD HOVER TILT FOR ABOUT PHOTO
     ---------------------------------------------------- */
  const aboutFrame = document.getElementById('aboutFrame');
  if (aboutFrame) {
    aboutFrame.addEventListener('mousemove', (e) => {
      const rect = aboutFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;
      
      const maxTilt = 12; // degrees
      const tiltX = percentY * maxTilt;
      const tiltY = -percentX * maxTilt;
      
      aboutFrame.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    aboutFrame.addEventListener('mouseleave', () => {
      aboutFrame.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 3D Card Hover Tilt for Academic Silicon Chip
  const academicFrame = document.getElementById('academicFrame');
  if (academicFrame) {
    academicFrame.addEventListener('mousemove', (e) => {
      const rect = academicFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;
      
      const maxTilt = 12; // degrees
      const tiltX = percentY * maxTilt;
      const tiltY = -percentX * maxTilt;
      
      academicFrame.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    academicFrame.addEventListener('mouseleave', () => {
      academicFrame.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }


  /* ----------------------------------------------------
     10. CONTACT FORM SUBMISSION HANDLER
     ---------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const statusElement = document.getElementById('formStatus');
  const terminalLogs = document.getElementById('terminalLogs');
  const terminalLogsBody = document.getElementById('terminalLogsBody');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        if (statusElement) {
          statusElement.style.display = 'block';
          statusElement.className = 'form-status error';
          statusElement.textContent = "Please fill in all parameters before submitting.";
        }
        return;
      }

      if (statusElement) statusElement.style.display = 'none';

      if (terminalLogs && terminalLogsBody) {
        terminalLogs.style.display = 'block';
        terminalLogsBody.innerHTML = '';
        
        const logs = [
          { text: '> INIT DATA_PACKET_TRANS...', type: 'info', delay: 0 },
          { text: `> SYS: client_name = "${name}"`, type: 'info', delay: 300 },
          { text: `> SYS: client_email = "${email}"`, type: 'info', delay: 600 },
          { text: '> SOCK: Opening TCP connection to SMTP relay...', type: 'info', delay: 1000 },
          { text: '> SOCK: Connection established to 184.22.109.12:465', type: 'success', delay: 1400 },
          { text: '> CRYPT: TLS handshake initialized (AES-256-GCM)...', type: 'info', delay: 1800 },
          { text: '> CRYPT: Handshake success. Session key verified.', type: 'success', delay: 2200 },
          { text: '> DATA: Compiling payload block structure...', type: 'info', delay: 2500 },
          { text: '> RELAY: SMTP SEND_CMD: Mail content packetized.', type: 'info', delay: 2900 },
          { text: '> RELAY: TRANSMISSION STATUS: 250 OK (Message Queued)', type: 'success', delay: 3300 },
          { text: '> SOCK: Port connection closed cleanly.', type: 'info', delay: 3600 },
          { text: `> SUCCESS: Thank you, ${name}! Your message was sent. Jubaer will respond shortly.`, type: 'success', delay: 4000 }
        ];

        logs.forEach(log => {
          setTimeout(() => {
            const line = document.createElement('div');
            line.className = `term-log-line ${log.type}`;
            line.textContent = log.text;
            terminalLogsBody.appendChild(line);
            terminalLogsBody.scrollTop = terminalLogsBody.scrollHeight;

            if (log === logs[logs.length - 1]) {
              if (statusElement) {
                statusElement.style.display = 'block';
                statusElement.className = 'form-status success';
                statusElement.textContent = `Thank you, ${name}! Your message has been transmitted successfully. Jubaer will contact you at ${email} as soon as possible.`;
              }
              contactForm.reset();
            }
          }, log.delay);
        });
      }
    });
  }

  /* ----------------------------------------------------
     DARK/LIGHT THEME SWITCHER CONTROLLER
     ---------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  
  function updateToggleIcons(isDark) {
    const iconHTML = isDark ? '<i class="fa-solid fa-lightbulb"></i>' : '<i class="fa-solid fa-moon"></i>';
    if (themeToggle) {
      themeToggle.innerHTML = iconHTML;
    }
    if (themeToggleMobile) {
      themeToggleMobile.innerHTML = isDark ? '<i class="fa-solid fa-lightbulb"></i> Toggle Theme' : '<i class="fa-solid fa-moon"></i> Toggle Theme';
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateToggleIcons(isDark);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
  }

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateToggleIcons(true);
  } else {
    updateToggleIcons(false);
  }

  /* ----------------------------------------------------
     About Me Tabs Toggling
     ---------------------------------------------------- */
  const aboutTabs = document.querySelectorAll('.about-tab-btn');
  const aboutPanes = document.querySelectorAll('.about-tab-pane');

  if (aboutTabs.length && aboutPanes.length) {
    aboutTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        aboutTabs.forEach(b => b.classList.remove('active'));
        aboutPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const paneId = `about-pane-${btn.getAttribute('data-about')}`;
        const targetPane = document.getElementById(paneId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  /* ----------------------------------------------------
     Academic Tabs Toggling
     ---------------------------------------------------- */
  const academicTabs = document.querySelectorAll('.academic-tab-btn');
  const academicPanes = document.querySelectorAll('.academic-tab-pane');

  if (academicTabs.length && academicPanes.length) {
    academicTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        academicTabs.forEach(b => b.classList.remove('active'));
        academicPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const paneId = `academic-pane-${btn.getAttribute('data-academic')}`;
        const targetPane = document.getElementById(paneId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  /* ----------------------------------------------------
     Technical Journal Article Reader Modal
     ---------------------------------------------------- */
  const articlesData = {
    riscv: {
      category: 'Hardware Architecture',
      date: 'May 18, 2026',
      title: "Why I'm Building a RISC-V CPU from Scratch",
      body: `
        <p>Designing the <strong>HaDes-V</strong> pipelined 32-bit RISC-V (RV32I) microcontroller core from scratch in SystemVerilog has been the single deepest learning curve of my undergraduate engineering journey so far.</p>
        <h4>1. Moving Beyond Black-Box Microcontrollers</h4>
        <p>Writing C/C++ firmware on STM32 or ESP32 teaches you how peripherals behave from the outside, but designing each pipeline stage—Instruction Fetch (IF), Decode (ID), Execute (EX), Memory (MEM), and Writeback (WB)—forces you to reason about every clock edge, setup/hold budget, and control signal.</p>
        <h4>2. Resolving Pipeline Hazards</h4>
        <ul>
          <li><strong>Data Hazards:</strong> Implemented register-file forwarding paths from EX/MEM and MEM/WB back into the ALU operands, paired with a load-use stall unit.</li>
          <li><strong>Control Hazards:</strong> Built deterministic branch resolution and pipeline flush logic to prevent speculative state corruption on taken branches and jumps.</li>
        </ul>
        <h4>3. Verification with Verilator &amp; GTKWave</h4>
        <p>Instead of relying solely on slow GUI simulations, I drive the RTL core with cycle-accurate C++ testbenches compiled via <strong>Verilator</strong>, inspecting VCD signal traces in <strong>GTKWave</strong> to verify instruction retirement against the RISC-V ISA reference model.</p>
      `
    },
    andes: {
      category: 'Hackathon Chronicles',
      date: 'March 12, 2026',
      title: 'What I Learned at Andes Hackathon 2025',
      body: `
        <p>Winning <strong>2nd Place</strong> at the international Andes Hackathon 2025 showed me how domain-specific hardware acceleration bridges the gap between software bottlenecks and silicon efficiency.</p>
        <h4>1. Custom Instructions with Andes ACE</h4>
        <p>Using the Andes Custom Extension (ACE) framework, our team profiled compute-heavy inner loops and identified repetitive bit-manipulation and matrix-accumulation sequences that were consuming dozens of scalar RISC-V cycles.</p>
        <h4>2. Hardware/Software Co-Design</h4>
        <ul>
          <li><strong>RTL Datapath:</strong> Designed custom combinational and multi-cycle execution units mapped directly to new custom opcodes.</li>
          <li><strong>Toolchain Integration:</strong> Configured compiler intrinsics and assembler mnemonics so C++ application code could invoke our hardware instructions seamlessly without inline assembly clutter.</li>
        </ul>
        <h4>3. Key Takeaway</h4>
        <p>Under tight hackathon deadlines, keeping calm, verifying corner cases early, and measuring cycle counts objectively made all the difference.</p>
      `
    },
    europe: {
      category: 'Career Strategy',
      date: 'Jan 5, 2026',
      title: 'My Plan to Work in Europe as an Engineer',
      body: `
        <p>Transitioning from an engineering classroom in Bangladesh to European semiconductor and embedded systems R&amp;D labs requires deliberate multi-year preparation rather than last-minute applications.</p>
        <h4>1. Proof-of-Work Hardware Portfolio</h4>
        <p>European hardware research groups and companies value verifiable artifacts: clean SystemVerilog repositories, Verilator test suites, FPGA synthesis reports, and international competition results like the TU Graz HaDes-V Challenge and Andes Hackathon.</p>
        <h4>2. Target Academic &amp; R&amp;D Ecosystems</h4>
        <ul>
          <li><strong>Nordic Research Hubs:</strong> KTH (Sweden), NTNU (Norway), Aalto University (Finland), and DTU (Denmark) for Master's programs in Embedded Systems, SoC, and Computer Architecture.</li>
          <li><strong>Continental Silicon Clusters:</strong> Germany (Munich, Dresden) and European open-source RISC-V university labs such as TU Graz and ETH Zurich ecosystems.</li>
        </ul>
        <h4>3. Next Milestones</h4>
        <p>Alongside maintaining a strong B.Sc. CGPA at Mymensingh Engineering College, my immediate priorities are completing the HaDes-V processor core, publishing peer-reviewed FPGA/VLSI research, and preparing for IELTS (7.0+).</p>
      `
    }
  };

  const articleModal = document.getElementById('articleModal');
  const articleModalClose = document.getElementById('articleModalClose');
  const articleModalCategory = document.getElementById('articleModalCategory');
  const articleModalDate = document.getElementById('articleModalDate');
  const articleModalTitle = document.getElementById('articleModalTitle');
  const articleModalBody = document.getElementById('articleModalBody');
  const blogReadBtns = document.querySelectorAll('.blog-read-btn');

  function closeArticleModal() {
    if (!articleModal) return;
    articleModal.classList.remove('active');
    articleModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (articleModal && blogReadBtns.length) {
    blogReadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-article');
        const article = articlesData[key];
        if (!article) return;

        if (articleModalCategory) articleModalCategory.textContent = article.category;
        if (articleModalDate) articleModalDate.textContent = article.date;
        if (articleModalTitle) articleModalTitle.textContent = article.title;
        if (articleModalBody) articleModalBody.innerHTML = article.body;

        articleModal.classList.add('active');
        articleModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    if (articleModalClose) {
      articleModalClose.addEventListener('click', closeArticleModal);
    }

    articleModal.addEventListener('click', (e) => {
      if (e.target === articleModal) {
        closeArticleModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && articleModal.classList.contains('active')) {
        closeArticleModal();
      }
    });
  }

});
