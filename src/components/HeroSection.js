import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // 滚动交互状态管理
  const [currentLayer, setCurrentLayer] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleAboutClick = () => {
    navigate('/about');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // 鼠标位置追踪
    let mouseX = 0;
    let mouseY = 0;
    let isMouseOver = false;

    // 设置canvas尺寸
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 鼠标事件监听
    const handleMouseMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      isMouseOver = true;
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
    };

    // 为整个section添加鼠标事件监听，确保覆盖文字区域
    const section = canvas.parentElement.parentElement;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // 为section添加鼠标事件，确保文字区域也能触发
    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseenter', handleMouseEnter);
    section.addEventListener('mouseleave', handleMouseLeave);

    // 滚轮事件监听
    const handleWheel = e => {
      e.preventDefault();

      if (isScrolling) return; // 防止快速滚动

      setIsScrolling(true);

      if (e.deltaY > 0) {
        // 向下滚动
        setCurrentLayer(prev => Math.min(prev + 1, 3));
      } else {
        // 向上滚动
        setCurrentLayer(prev => Math.max(prev - 1, 0));
      }

      // 防抖处理
      setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };

    section.addEventListener('wheel', handleWheel, { passive: false });

    // 创建正十二面体的顶点
    function createDodecahedronVertices() {
      const phi = (1 + Math.sqrt(5)) / 2;
      const vertices = [];

      // 添加所有20个顶点
      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          for (let k = -1; k <= 1; k += 2) {
            vertices.push([i, j, k]);
          }
        }
      }

      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          vertices.push([0, i / phi, j * phi]);
        }
      }

      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          vertices.push([i / phi, j * phi, 0]);
        }
      }

      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          vertices.push([i * phi, 0, j / phi]);
        }
      }

      return vertices;
    }

    const vertices = createDodecahedronVertices();

    // 计算边
    function createDodecahedronEdges(vertices) {
      const edges = [];
      const edgeLength = 2 / ((1 + Math.sqrt(5)) / 2);
      const tolerance = 0.01;

      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const dist = Math.sqrt(
            Math.pow(vertices[i][0] - vertices[j][0], 2) +
              Math.pow(vertices[i][1] - vertices[j][1], 2) +
              Math.pow(vertices[i][2] - vertices[j][2], 2)
          );

          if (Math.abs(dist - edgeLength) < tolerance) {
            edges.push([i, j]);
          }
        }
      }

      return edges;
    }

    const edges = createDodecahedronEdges(vertices);

    // 两个十二面体的独立旋转状态
    let rotation1 = { x: 0, y: 0, z: 0 };
    let rotation2 = { x: Math.PI / 4, y: Math.PI / 3, z: Math.PI / 6 };

    function project3D(vertex, rotation, scale, offsetX = 0, offsetY = 0) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      let [x, y, z] = vertex;

      // X轴旋转
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;

      // Y轴旋转
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      let x2 = x * cosY + z1 * sinY;
      let z2 = -x * sinY + z1 * cosY;

      // Z轴旋转
      const cosZ = Math.cos(rotation.z);
      const sinZ = Math.sin(rotation.z);
      let x3 = x2 * cosZ - y1 * sinZ;
      let y3 = x2 * sinZ + y1 * cosZ;

      // 透视投影
      const distance = 5;
      const factor = distance / (distance + z2);

      return {
        x: centerX + offsetX + x3 * scale * factor,
        y: centerY + offsetY + y3 * scale * factor,
        depth: z2,
      };
    }

    function drawDodecahedron(
      rotation,
      scale,
      strokeStyle,
      lineWidth,
      alpha,
      offsetX = 0,
      offsetY = 0
    ) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = alpha;

      edges.forEach(edge => {
        const p1 = project3D(
          vertices[edge[0]],
          rotation,
          scale,
          offsetX,
          offsetY
        );
        const p2 = project3D(
          vertices[edge[1]],
          rotation,
          scale,
          offsetX,
          offsetY
        );

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
    }

    // 随机性变化
    let wobble = {
      x: Math.random() * 0.002 + 0.001,
      y: Math.random() * 0.002 + 0.001,
      z: Math.random() * 0.002 + 0.001,
    };

    function updateWobble() {
      if (Math.random() < 0.01) {
        wobble.x = Math.random() * 0.004 - 0.002 + 0.002;
        wobble.y = Math.random() * 0.004 - 0.002 + 0.002;
        wobble.z = Math.random() * 0.004 - 0.002 + 0.002;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 如果鼠标在canvas上，创建渐变圆形遮罩
      if (isMouseOver) {
        ctx.save();

        // 创建径向渐变遮罩（从中心到边缘的渐变）
        const gradient = ctx.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          400
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // 中心完全不透明
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.8)'); // 70%位置开始淡化
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // 边缘完全透明

        // 先绘制渐变遮罩
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 设置混合模式，让12面体只在渐变区域显示
        ctx.globalCompositeOperation = 'source-atop';

        // 在渐变区域内绘制多个十二面体覆盖整个区域
        // 中间的十二面体（更大）
        drawDodecahedron(rotation2, 400, '#9ca3af', 1, 0.3);
        drawDodecahedron(rotation1, 250, '#9ca3af', 1, 0.4);

        // 左边的十二面体（更贴近边缘）
        drawDodecahedron(rotation2, 400, '#9ca3af', 1, 0.3, -600, 0);
        drawDodecahedron(rotation1, 250, '#9ca3af', 1, 0.4, -600, 0);

        // 右边的十二面体（更贴近边缘）
        drawDodecahedron(rotation2, 400, '#9ca3af', 1, 0.3, 600, 0);
        drawDodecahedron(rotation1, 250, '#9ca3af', 1, 0.4, 600, 0);

        // 左上角的十二面体
        drawDodecahedron(rotation2, 350, '#9ca3af', 1, 0.25, -500, -200);
        drawDodecahedron(rotation1, 200, '#9ca3af', 1, 0.35, -500, -200);

        // 右上角的十二面体
        drawDodecahedron(rotation2, 350, '#9ca3af', 1, 0.25, 500, -200);
        drawDodecahedron(rotation1, 200, '#9ca3af', 1, 0.35, 500, -200);

        // 左下角的十二面体
        drawDodecahedron(rotation2, 350, '#9ca3af', 1, 0.25, -500, 200);
        drawDodecahedron(rotation1, 200, '#9ca3af', 1, 0.35, -500, 200);

        // 右下角的十二面体
        drawDodecahedron(rotation2, 350, '#9ca3af', 1, 0.25, 500, 200);
        drawDodecahedron(rotation1, 200, '#9ca3af', 1, 0.35, 500, 200);

        // 恢复混合模式
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore(); // 恢复绘制状态
      }

      // 更新旋转角度
      rotation1.x += 0.003;
      rotation1.y += 0.005;
      rotation1.z += 0.002;

      // 外层随机旋转
      updateWobble();
      rotation2.x += wobble.x;
      rotation2.y -= wobble.y;
      rotation2.z += wobble.z * 1.5;

      rotation2.x += Math.sin(Date.now() * 0.0001) * 0.001;
      rotation2.y += Math.cos(Date.now() * 0.00015) * 0.001;

      animationId = requestAnimationFrame(draw);
    }

    draw();

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseenter', handleMouseEnter);
      section.removeEventListener('mouseleave', handleMouseLeave);
      section.removeEventListener('wheel', handleWheel);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className='pt-20 pb-36 bg-white min-h-[75vh] flex items-center relative overflow-hidden'>
      {/* 12面體背景 */}
      <div className='dodecahedron-container'>
        <canvas ref={canvasRef} id='dodecahedron-bg'></canvas>
      </div>

      {/* 滚动交互文字内容 */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full relative z-10 bg-transparent pointer-events-none'>
        <div className='flex flex-col items-center justify-center space-y-4 bg-transparent'>
          {/* 第一层：One Platform */}
          <div
            className={`transition-all duration-700 ease-in-out bg-transparent ${
              currentLayer >= 0
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <h1 className='text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight'>
              One Platform
            </h1>
          </div>

          {/* 第二层：All Students */}
          <div
            className={`transition-all duration-700 ease-in-out bg-transparent ${
              currentLayer >= 1
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <h1 className='font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight'>
              All Students
            </h1>
          </div>

          {/* 第三层：Across All Majors */}
          <div
            className={`transition-all duration-700 ease-in-out bg-transparent ${
              currentLayer >= 2
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <h1 className='font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight'>
              Across All Majors
            </h1>
          </div>

          {/* 第四层：副标题和按钮 */}
          <div
            className={`transition-all duration-700 ease-in-out bg-transparent ${
              currentLayer >= 3
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
          >
            <p className='text-base md:text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed'>
              A bridge for art students to showcase, connect, and collaborate
            </p>
            <button
              onClick={handleAboutClick}
              className='bg-transparent text-black px-8 py-3 rounded-md text-lg font-medium border border-black hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-200 pointer-events-auto'
            >
              About TAG
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
