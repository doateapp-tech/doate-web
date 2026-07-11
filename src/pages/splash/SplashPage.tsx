import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashPage() {

  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    const navigateTimer = setTimeout(() => {
      navigate("/home");
    }, 4200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
    };

  }, [navigate]);

  return (
    <>
      <div className={`splash-container ${fadeOut ? "fade-out" : ""}`}>

        <div className="drop-wrapper">

          <svg
            className="drop"
            viewBox="0 0 200 240"
          >
            <defs>
              <mask id="drop-mask">

                <rect width="100%" height="100%" fill="black" />

                <path
                  fill="white"
                  d="
                  M100 0
                  C70 60 20 110 20 160
                  C20 205 55 240 100 240
                  C145 240 180 205 180 160
                  C180 110 130 60 100 0
                  Z
                  "
                />

              </mask>
            </defs>

            {/* sangue animado */}
            <rect
              className="blood"
              x="0"
              y="240"
              width="200"
              height="240"
              mask="url(#drop-mask)"
            />

            {/* gota branca */}
            <path
              className="drop-shape"
              d="
              M100 0
              C70 60 20 110 20 160
              C20 205 55 240 100 240
              C145 240 180 205 180 160
              C180 110 130 60 100 0
              Z
              "
            />

            {/* racha da gota */}
            <path
              className="drop-crack"
              d="M82 150 C72 170 74 200 96 215"
            />

          </svg>

        </div>

      </div>

      <style>{`

      .splash-container{

        width:100vw;
        height:100vh;

        display:flex;
        align-items:center;
        justify-content:center;

        background:linear-gradient(
          180deg,
          #ff5a6f 0%,
          #e5203a 50%,
          #8b0e1c 100%
        );

        transition:opacity .6s ease;

      }

      .fade-out{
        opacity:0;
      }

      .drop-wrapper{

        display:flex;
        align-items:center;
        justify-content:center;

      }

      .drop{

        width:120px;
        height:auto;

      }

      .drop-shape{

        fill:white;

      }

      .drop-crack{

        fill:none;
        stroke:#f5c8cf;
        stroke-width:4;
        stroke-linecap:round;
        opacity:.9;

      }

      .blood{

        fill:#e5203a;

        animation:bloodFlow 4s ease-in-out infinite;

        transform-origin:center;
        will-change:transform;

      }

      @keyframes bloodFlow{

        0%{
          transform:translateY(240px);
        }

        40%{
          transform:translateY(20px);
        }

        50%{
          transform:translateY(0px);
        }

        60%{
          transform:translateY(0px);
        }

        100%{
          transform:translateY(240px);
        }

      }

      `}</style>
    </>
  );
}