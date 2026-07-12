import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashPage() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 4000);
    const navTimer = setTimeout(() => navigate("/home"), 4700);
    return () => { clearTimeout(fadeTimer); clearTimeout(navTimer); };
  }, [navigate]);

  return (
    <>
      <div className={`splash-container ${fadeOut ? "fade-out" : ""}`}>
        <div className="splash-inner">
          <svg viewBox="0 0 200 260" className="drop-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="drop-clip">
                <path d="M100 10 C70 70 18 120 18 168 C18 216 55 252 100 252 C145 252 182 216 182 168 C182 120 130 70 100 10 Z"/>
              </clipPath>
              <linearGradient id="blood-shine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#8b0000" stopOpacity="0.4"/>
                <stop offset="40%"  stopColor="#ff3355" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#8b0000" stopOpacity="0.3"/>
              </linearGradient>
            </defs>

            {/* fundo da gota vazia */}
            <path
              d="M100 10 C70 70 18 120 18 168 C18 216 55 252 100 252 C145 252 182 216 182 168 C182 120 130 70 100 10 Z"
              fill="rgba(255,255,255,0.12)" stroke="white" strokeWidth="2.5"
            />

            {/* sangue a encher */}
            <g clipPath="url(#drop-clip)">
              <rect x="0" y="0" width="200" height="260" fill="#ffffffff"/>
              <rect x="0" y="0" width="200" height="260" fill="#ffffffff">
                <animate attributeName="y" values="260;0" dur="2.8s" begin="0.3s" fill="freeze"
                  calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1"/>
              </rect>
              <rect x="0" y="0" width="200" height="260" fill="url(#blood-shine)"/>
              {/* onda no topo do sangue */}
              <ellipse cx="100" cy="0" rx="100" ry="18" fill="#ffffffff" opacity="0.7">
                <animate attributeName="cy" values="260;0" dur="2.8s" begin="0.3s" fill="freeze"
                  calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1"/>
              </ellipse>
            </g>

            {/* contorno da gota */}
            <path
              d="M100 10 C70 70 18 120 18 168 C18 216 55 252 100 252 C145 252 182 216 182 168 C182 120 130 70 100 10 Z"
              fill="none" stroke="white" strokeWidth="2.5" opacity="0.9"
            />

            {/* rachadura */}
            <path d="M78 155 C68 178 72 208 94 222"
              fill="none" stroke="rgba(255,200,210,0.7)" strokeWidth="3.5" strokeLinecap="round"/>

            {/* brilho lateral */}
            <ellipse cx="68" cy="130" rx="7" ry="11"
              fill="rgba(255,255,255,0.12)" transform="rotate(-25 68 130)"/>
          </svg>

       
          
        </div>
      </div>

      <style>{`
        .splash-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  overflow: hidden;

  background: linear-gradient(
    180deg,
    #ff5a6f 0%,
    #c0152a 60%,
    #8b0000 100%
  );

  transition: opacity .6s ease;
}

.fade-out{
  opacity:0;
}

.splash-inner{
  width:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
}

.drop-svg{
  width:140px;
  max-width:45vw;
  height:auto;
}

.splash-title{
  margin-top:20px;
  color:rgba(255,255,255,.95);
  font-size:26px;
  font-weight:600;
  letter-spacing:.1em;
  text-align:center;
}

.splash-sub{
  margin-top:8px;
  color:rgba(255,255,255,.65);
  font-size:14px;
  text-align:center;
}

@media (max-width:768px){

  .drop-svg{
    width:120px;
  }

  .splash-title{
    font-size:22px;
  }

  .splash-sub{
    font-size:13px;
  }

}

@media (max-width:480px){

  .drop-svg{
    width:100px;
  }

  .splash-title{
    font-size:20px;
  }

  .splash-sub{
    font-size:12px;
  }

}
    
      `}</style>
    </>
  );
}