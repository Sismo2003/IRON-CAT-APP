import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import BreadCrumb from "Common/BreadCrumb";
import { 
  SketchPicker, 
  TwitterPicker, 
  ChromePicker, 
  CompactPicker, 
  SwatchesPicker, 
  CirclePicker, 
  GithubPicker, 
  HuePicker 
} from "react-color";

const FormColorPicker: React.FC = () => {
  // Estados para cada color picker
  const [color, setColor] = useState({ r: 63, g: 81, b: 181, a: 0.8 });
  const [twitterPicker, setTwitterPicker] = useState("#3498db");
  const [chromeColor, setChromeColor] = useState({ r: 63, g: 81, b: 181 });
  const [compactColor, setCompactColor] = useState("#A4DD00");
  const [swatchesColor, setSwatchesColor] = useState({ r: 255, g: 235, b: 59 });
  const [circleColor, setCircleColor] = useState({ r: 156, g: 39, b: 176 });
  const [githubColor, setGithubColor] = useState({ r: 196, g: 222, b: 246 });
  const [hueColor, setHueColor] = useState({ r: 255, g: 138, b: 101 });

  // Refs individuales para cada picker
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const ref4 = useRef<HTMLDivElement>(null);
  const ref5 = useRef<HTMLDivElement>(null);
  const ref6 = useRef<HTMLDivElement>(null);

  // Array memoizado de refs
  const contentRefs = useMemo(() => [ref0, ref1, ref2, ref3, ref4, ref5, ref6], []);

  // Estado para mostrar/ocultar los pickers
  const [displayColorPickers, setDisplayColorPickers] = useState<boolean[]>(
    Array(contentRefs.length).fill(false)
  );

  // Estilos para los botones de cada picker
  const pickerStyles = useMemo(() => ({
    sketch: {
      width: "36px",
      height: "14px",
      borderRadius: "2px",
      background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
    },
    chrome: {
      width: "36px",
      height: "14px",
      borderRadius: "2px",
      background: `rgba(${chromeColor.r}, ${chromeColor.g}, ${chromeColor.b})`,
    },
    compact: {
      width: "36px",
      height: "14px",
      borderRadius: "2px",
      background: compactColor,
    },
    swatches: {
      width: "36px",
      height: "14px",
      borderRadius: "2px",
      background: `rgba(${swatchesColor.r}, ${swatchesColor.g}, ${swatchesColor.b})`,
    },
    circle: {
      width: "36px",
      height: "14px",
      borderRadius: "2px",
      background: `rgba(${circleColor.r}, ${circleColor.g}, ${circleColor.b})`,
    },
    github: {
      width: "36px",
      height: "14px",
      borderRadius: "2px",
      background: `rgba(${githubColor.r}, ${githubColor.g}, ${githubColor.b})`,
    },
    hue: {
      width: "36px",
      height: "14px",
      borderRadius: "2px",
      marginBlock: "3px",
      background: `rgba(${hueColor.r}, ${hueColor.g}, ${hueColor.b})`,
    }
  }), [color, chromeColor, compactColor, swatchesColor, circleColor, githubColor, hueColor]);

  // Handler para toggle de pickers
  const handlePickerToggle = useCallback((index: number) => {
    setDisplayColorPickers(prev => 
      prev.map((_, i) => (i === index ? !prev[i] : false))
    );
  }, []);

  // Effect para manejar clicks fuera de los pickers
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent, index: number) => {
      const currentRef = contentRefs[index]?.current;
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setDisplayColorPickers(prev => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      }
    };

    const listeners: (() => void)[] = contentRefs.map((_, index) => {
      const listener = (e: MouseEvent) => handleOutsideClick(e, index);
      document.addEventListener("click", listener);
      return () => document.removeEventListener("click", listener);
    });

    return () => listeners.forEach(cleanup => cleanup());
  }, [contentRefs]);

  return (
    <div className="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">
      <BreadCrumb title="Color Picker" pageTitle="Forms" />

      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-3">
        {/* Sketch Picker */}
        <div className="card">
          <div className="card-body" ref={ref0}>
            <h6 className="mb-1 text-gray-800 text-15 dark:text-white">SketchPicker Demo</h6>
            <button 
              style={pickerStyles.sketch} 
              className="SketchPicker-colorpicker" 
              onClick={() => handlePickerToggle(0)} 
            />
            {displayColorPickers[0] && (
              <div style={{ position: "absolute", zIndex: 2 }}>
                <SketchPicker 
                  color={color} 
                  onChange={(newColor) => {
										const { r, g, b, a } = newColor.rgb;
										setColor({ r, g, b, a: a ?? 1 }); // Si `a` es undefined, usamos 1 como valor por defecto
									}}
                />
              </div>
            )}
          </div>
        </div>

        {/* Chrome Picker */}
        <div className="card">
          <div className="card-body" ref={ref1}>
            <h6 className="mb-1 text-gray-800 text-15 dark:text-white">ChromePicker Demo</h6>
            <button 
              style={pickerStyles.chrome} 
              className="classic-colorpicker" 
              onClick={() => handlePickerToggle(1)} 
            />
            {displayColorPickers[1] && (
              <div style={{ position: "absolute", zIndex: 2 }}>
                <ChromePicker 
                  color={chromeColor} 
                  onChange={(newColor) => setChromeColor(newColor.rgb)} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Compact Picker */}
        <div className="card">
          <div className="card-body" ref={ref2}>
            <h6 className="mb-1 text-gray-800 text-15 dark:text-white">CompactPicker Demo</h6>
            <button 
              style={pickerStyles.compact} 
              onClick={() => handlePickerToggle(2)} 
            />
            {displayColorPickers[2] && (
              <div style={{ position: "absolute", zIndex: 2 }}>
                <CompactPicker 
                  color={compactColor} 
                  onChange={(newColor) => setCompactColor(newColor.hex)} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Swatches Picker */}
        <div className="card">
          <div className="card-body" ref={ref3}>
            <h6 className="mb-1 text-gray-800 text-15 dark:text-white">SwatchesPicker Demo</h6>
            <button 
              style={pickerStyles.swatches} 
              className="colorpicker-demo" 
              onClick={() => handlePickerToggle(3)} 
            />
            {displayColorPickers[3] && (
              <div style={{ position: "absolute", zIndex: 2 }}>
                <SwatchesPicker
                  color={swatchesColor}
                  onChange={(newColor) => setSwatchesColor(newColor.rgb)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Github Picker */}
        <div className="card">
          <div className="card-body" ref={ref4}>
            <h6 className="mb-1 text-gray-800 text-15 dark:text-white">GithubPicker Demo</h6>
            <button 
              style={pickerStyles.github} 
              className="colorpicker-switch" 
              onClick={() => handlePickerToggle(4)} 
            />
            {displayColorPickers[4] && (
              <div style={{ position: "absolute", zIndex: 2 }}>
                <GithubPicker 
                  color={githubColor} 
                  onChange={(newColor) => setGithubColor(newColor.rgb)} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Hue Picker */}
        <div className="card">
          <div className="card-body" ref={ref5}>
            <h6 className="mb-1 text-gray-800 text-15 dark:text-white">HuePicker Demo</h6>
            <div 
              style={pickerStyles.hue} 
              className="SketchPicker-colorpicker" 
              onClick={() => handlePickerToggle(5)} 
            />
            {displayColorPickers[5] && (
              <div style={{ position: "absolute", zIndex: 2 }}>
                <HuePicker 
                  color={hueColor} 
                  onChange={(newColor) => setHueColor(newColor.rgb)} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Circle Picker */}
        <div className="card">
          <div className="card-body" ref={ref6}>
            <h6 className="mb-1 text-gray-800 text-15 dark:text-white">CirclePicker Demo</h6>
            <button 
              style={pickerStyles.circle} 
              className="colorpicker-switch" 
              onClick={() => handlePickerToggle(6)} 
            />
            {displayColorPickers[6] && (
              <div style={{ position: "absolute", zIndex: 2 }}>
                <CirclePicker 
                  color={circleColor} 
                  onChange={(newColor) => setCircleColor(newColor.rgb)} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Twitter Picker (sin popup) */}
        <div className="card">
          <div className="card-body">
            <h6 className="mb-1 text-gray-800 text-15 dark:text-white">TwitterPicker Demo</h6>
            <TwitterPicker 
              color={twitterPicker} 
              onChange={(newColor) => setTwitterPicker(newColor.hex)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormColorPicker;