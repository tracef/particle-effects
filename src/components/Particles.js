import './Particles.css';
import { useEffect } from 'react';

export const Particles = ({ parentContainerID, particleColor }) => {
    var canvas = null;
    var ctx = null;
    var particlesArray = null;
    var mouse = null;

    useEffect(() => {
        canvasInit();
        createListeners();
        particlesInit();
        animate();
    })

    const canvasInit = () => {
        canvas = document.getElementById('particle_canvas');
        canvas.width = document.getElementById(parentContainerID).clientWidth;
        canvas.height = document.getElementById(parentContainerID).clientHeight;
        ctx = canvas.getContext('2d');

        mouse = {
            x: null,
            y: null,
            radius: calcMouseRadius()
        }
    }

    const createListeners = () => {
        window.addEventListener('mousemove', (event) => {
            setMouseXY(event.x, event.y);
        });

        window.addEventListener('mouseout', () => {
            setMouseXY(undefined, undefined)
        });

        window.addEventListener('resize', () => {
            canvas.width = document.getElementById(parentContainerID).clientWidth;
            canvas.height = document.getElementById(parentContainerID).clientHeight;
            mouse.radius = calcMouseRadius();
            particlesInit();
        })
    }

    const setMouseXY = (x, y) => {
        mouse.x = x;
        mouse.y = y;
    }

    const calcMouseRadius = () => {
        return (canvas.height / 90) * (canvas.width / 90);
    }

    const particlesInit = () => {
        particlesArray = [];
        let numberOfParticles = Math.floor((canvas.height * canvas.width) / 10000);

        for (let i = 0; i < numberOfParticles; i++) {
            let size = getParticleSize(),
                x = getParticlePosByAxis(canvas.width, size),
                y = getParticlePosByAxis(canvas.height, size),
                directionX = getDirectionForAxis(),
                directionY = getDirectionForAxis(),
                color = particleColor;
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    const getParticleSize = () => {
        return (Math.random() * 5) + 1;
    }

    const getParticlePosByAxis = (axisSize, particleSize) => {
        return (Math.random() * ((axisSize - particleSize * 2) - (particleSize * 2)) + particleSize * 2);
    }

    const getDirectionForAxis = () => {
        return (Math.random() * 5) - 2.5;
    }

    const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }

        connect();
    }

    const connect = () => {
        let opacity = 1;

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let aX = particlesArray[a].x,
                    aY = particlesArray[a].y,
                    bX = particlesArray[b].x,
                    bY = particlesArray[b].y,
                    distance = getDistanceBetweenXYSquared(aX, bX, aY, bY);

                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacity = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(0,0,0,${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(aX, aY)
                    ctx.lineTo(bX, bY);
                    ctx.stroke();
                }
            }
        }
    }

    const getDistanceBetweenXYSquared = (aX, bX, aY, bY) => {
        return Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2);
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw = () => {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update = () => {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }

            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }

                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }

                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }

                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    return (
        <canvas id="particle_canvas"></canvas>
    )
}