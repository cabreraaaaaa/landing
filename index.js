
        // --- 1. DARK MODE TOGGLE ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        const lightIcon = document.getElementById('theme-toggle-light-icon');

        // Check if dark mode is preferred or set
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            lightIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            darkIcon.classList.remove('hidden');
        }

        themeToggleBtn.addEventListener('click', function() {
            darkIcon.classList.toggle('hidden');
            lightIcon.classList.toggle('hidden');

            if (localStorage.getItem('color-theme')) {
                if (localStorage.getItem('color-theme') === 'light') {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                }
            } else {
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                }
            }
        });

        // --- 2. SCROLL ANIMATIONS (Intersection Observer) ---
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-up').forEach((elem) => {
            observer.observe(elem);
        });

        // --- 3. NAVBAR EFECTO SCROLL ---
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 20) {
                nav.classList.add('shadow-lg');
            } else {
                nav.classList.remove('shadow-lg');
            }
        });

        // --- 4. CANVAS BACKGROUND (Estrellas/Partículas Premium) ---
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            const particleCount = window.innerWidth < 768 ? 30 : 70;

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    // Colores: Oro sutil o rojo oscuro
                    color: Math.random() > 0.5 ? '#d4af37' : '#900c3f'
                });
            }
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        function animateCanvas() {
            requestAnimationFrame(animateCanvas);
            ctx.clearRect(0, 0, width, height);
            
            const isDark = document.documentElement.classList.contains('dark');

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Rebotar bordes
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Interacción con mouse (esquivar suavemente)
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - p.x;
                    let dy = mouse.y - p.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        p.x -= dx * 0.02;
                        p.y -= dy * 0.02;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                // Ajustar opacidad según el tema para que no estorbe
                ctx.globalAlpha = isDark ? 0.3 : 0.1;
                ctx.fill();
            });

            // Conectar partículas cercanas
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = particles[i].color;
                        ctx.globalAlpha = isDark ? (120 - distance) / 1000 : (120 - distance) / 2000;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', initCanvas);
        
        // Observar cambios de tema para reiniciar el canvas con las opacidades correctas
        const observerTheme = new MutationObserver(() => {
            initCanvas();
        });
        observerTheme.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        initCanvas();
        animateCanvas();

        // --- 5. TERMINAL: EJECUCIÓN DE PSEUDOCÓDIGO EN VIVO ---
        const pseudoSnippets = [
            {
                code: "Escribir 'Ingrese número A:'",
                outputs: ["› Valor A = 14"]
            },
            {
                code: "total <- A * 2; Escribir total;",
                outputs: ["› Calculando...", "› Salida: 28"]
            },
            {
                code: "Si (total > 20) Entonces",
                outputs: ["› Condición VERDADERA", "› FinProceso"]
            }
        ];
        let pIndex = 0, charIndex = 0;
        const pLineEl = document.getElementById("live-pseudocode-line");
        const pOutEl = document.getElementById("live-pseudocode-output");

        function typePseudocode() {
            const current = pseudoSnippets[pIndex];
            if (charIndex < current.code.length) {
                pLineEl.textContent = current.code.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typePseudocode, 50);
            } else {
                setTimeout(() => {
                    pOutEl.innerHTML = current.outputs.map(o => `<div>${o}</div>`).join('');
                    setTimeout(() => {
                        pLineEl.textContent = "";
                        pOutEl.innerHTML = "";
                        charIndex = 0;
                        pIndex = (pIndex + 1) % pseudoSnippets.length;
                        typePseudocode();
                    }, 2000);
                }, 400);
            }
        }
        typePseudocode();

        // --- 6. SIMULADOR INTEL 8085 EN VIVO ---
        const i8085Steps = [
            { line: 1, a: "05H", b: "00H", pc: "0802H", flags: "S:0 Z:0 CY:0", status: "[EXEC] MVI A, 05H" },
            { line: 2, a: "05H", b: "05H", pc: "0803H", flags: "S:0 Z:0 CY:0", status: "[EXEC] MOV B, A" },
            { line: 3, a: "06H", b: "05H", pc: "0804H", flags: "S:0 Z:0 CY:0", status: "[EXEC] INR A (Increment)" },
            { line: 4, a: "06H", b: "05H", pc: "0807H", flags: "S:0 Z:0 CY:0", status: "[STORE] Memory [2050H] = 06H" }
        ];
        let i8085Index = 0;

        setInterval(() => {
            for (let i = 1; i <= 4; i++) {
                const el = document.getElementById(`asm8085-${i}`);
                if (el) el.className = "flex items-center gap-2 px-1.5 py-0.5 rounded transition-all";
            }
            const s = i8085Steps[i8085Index];
            const activeEl = document.getElementById(`asm8085-${s.line}`);
            if (activeEl) {
                activeEl.className = "flex items-center gap-2 px-1.5 py-0.5 rounded transition-all bg-gold/15 border-l-2 border-gold";
            }
            
            document.getElementById("reg-a").textContent = s.a;
            document.getElementById("reg-b").textContent = s.b;
            document.getElementById("reg-pc").textContent = s.pc;
            document.getElementById("i8085-flags").textContent = s.flags;
            document.getElementById("asm-status").textContent = s.status;

            i8085Index = (i8085Index + 1) % i8085Steps.length;
        }, 1300);

