import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./QRScanner.css";

interface Props {
  onScan: (qr: string) => void;
}

export default function QRScanner({ onScan }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    // Evita erro em ambientes sem navegador
    if (!window || !navigator.mediaDevices) {
      console.error("Câmera não suportada neste navegador");
      return;
    }

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const stopScanner = async () => {
      if (scannerRef.current && isRunningRef.current) {
        try {
          await scannerRef.current.stop();
          isRunningRef.current = false;
        } catch (err) {
          console.warn("Erro ao parar scanner:", err);
        }
      }
    };

    const handleSuccess = (decodedText: string) => {
      onScan(decodedText);
      stopScanner(); 
    };

    const handleError = (errorMessage: string) => {

      console.log("QR error:", errorMessage);
    };

    const startScanner = async () => {
      if (isRunningRef.current) return;

      try {
      
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          handleSuccess,
          handleError
        );

        isRunningRef.current = true;
      } catch (error) {
        console.warn("Falha na câmera traseira, tentando frontal...", error);

        try {
          await scanner.start(
            { facingMode: "user" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            handleSuccess,
            handleError
          );

          isRunningRef.current = true;
        } catch (err) {
          console.error("Erro ao iniciar qualquer câmera:", err);
        }
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onScan]);

  return (
    <div className="scanner-container">
      {/* Área da câmera */}
      <div id="reader" className="reader" />

      {/* Overlay visual */}
      <div className="scanner-overlay">
        <div className="scanner-box" />
      </div>
    </div>
  );
}