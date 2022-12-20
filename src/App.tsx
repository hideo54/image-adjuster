import { useState } from 'react';
import styled from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';

const RelativeDiv = styled.div`
  position: relative;
  margin: 0 auto;
`;

const BaseImg = styled.img<{
  opacity: number;
}>`
  position: absolute;
  inset: 1em;
  width: 80%;
  margin: 0 auto;
  opacity: ${props => props.opacity};
`;

const OverlayImg = styled.img<{
  opacity: number;
  x: number;
  y: number;
  deg: number;
}>`
  position: absolute;
  inset: 1em;
  width: 80%;
  margin: 0 auto;
  opacity: ${props => props.opacity};
  transform:
    translateX(${props => props.x}px)
    translateY(${props => props.y}px)
    rotate(${props => props.deg}deg);
`;

const indexToImagePath = (n: number) => `indexed_images/${n.toString().padStart(2, '0')}.jpg`;

const App = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [deg, setDeg] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [baseOpacity, setBaseOpacity] = useState(0.5);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const baseImagePath = indexToImagePath(currentIndex);
  const overlayImagePath = indexToImagePath(currentIndex + 1);
  useHotkeys('left', () => setX(n => n - 1));
  useHotkeys('right', () => setX(n => n + 1));
  useHotkeys('up', () => setY(n => n - 1));
  useHotkeys('down', () => setY(n => n + 1));
  useHotkeys('w', () => setDeg(d => d - 1));
  useHotkeys('s', () => setDeg(d => d + 1));
  return (
    <main>
      <h1>Image Adjuster</h1>
      <section>
        <h2>Current Adjustment Parameters</h2>
        <ul>
          <li>x: {x} px</li>
          <li>y: {y} px</li>
          <li>deg: {deg} deg</li>
        </ul>
      </section>
      <section>
        <h2>Overlay</h2>
        <RelativeDiv>
          <BaseImg
            src={baseImagePath}
            opacity={baseOpacity}
          />
          <OverlayImg
            src={overlayImagePath}
            opacity={overlayOpacity}
            x={x}
            y={y}
            deg={deg}
          />
        </RelativeDiv>
      </section>
    </main>
  );
};

export default App;
