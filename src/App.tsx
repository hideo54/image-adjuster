import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';

const MAX_INDEX = 53;

const RelativeDiv = styled.div`
  position: relative;
  margin: 0 auto;
`;

const BaseImg = styled.img<{
  opacity: number;
}>`
  position: absolute;
  inset: 1em;
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
  margin: 0 auto;
  opacity: ${props => props.opacity};
  transform:
    translateX(${props => props.x}px)
    translateY(${props => props.y}px)
    rotate(${props => props.deg}deg);
`;

const OpacityInput: React.FC<{
  value: number;
  setFunc: (n: number) => void;
  disabled: boolean;
}> = ({ value, setFunc, disabled }) => (
  <input
    type='range'
    value={value}
    min={0}
    max={1}
    step={0.1}
    onChange={e => setFunc(e.target.valueAsNumber)}
    disabled={disabled}
  />
);

const ContainerDiv = styled.div`
  display: flex;
  justify-content: center;
  & > .item {
    margin: 0 1em;
  }
`;

const indexToImagePath = (n: number) => `indexed_images/${n.toString().padStart(2, '0')}.jpg`;

const App = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [deg, setDeg] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [baseOpacity, setBaseOpacity] = useState(0.5);
  const [enableBlink, setEnableBlink] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const baseImagePath = indexToImagePath(currentIndex);
  const overlayImagePath = indexToImagePath(currentIndex + 1);
  const commonOption = { preventDefault: true };
  useHotkeys('left', () => setX(n => n - 1), commonOption);
  useHotkeys('right', () => setX(n => n + 1), commonOption);
  useHotkeys('up', () => setY(n => n - 1), commonOption);
  useHotkeys('down', () => setY(n => n + 1), commonOption);
  useHotkeys('w', () => setDeg(d => Math.floor(10 * d - 1) / 10), commonOption);
  useHotkeys('s', () => setDeg(d => Math.floor(10 * d + 1) / 10), commonOption);
  useEffect(() => {
    if (enableBlink) {
      const blinker = setInterval(() => {
        setBaseOpacity(n => n === 1 ? 0 : 1);
        setOverlayOpacity(n => n === 0 ? 1 : 0);
      }, 1000);
      return () => {
        clearInterval(blinker);
        setBaseOpacity(0.5);
        setOverlayOpacity(0.5);
      };
    }
  }, [enableBlink]);
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
        <ContainerDiv>
          <div className='item'>
            <div>{baseImagePath.split('/')[1]}</div>
            <div>
               <OpacityInput
                value={baseOpacity}
                setFunc={setBaseOpacity}
                disabled={enableBlink}
              />
            </div>
          </div>
          <div className='item'>
            <div>{overlayImagePath.split('/')[1]}</div>
            <div>
              <OpacityInput
                value={overlayOpacity}
                setFunc={setOverlayOpacity}
                disabled={enableBlink}
              />
            </div>
          </div>
        </ContainerDiv>
        <div>
          <button onClick={() => setEnableBlink(b => !b)}>
            {enableBlink ? 'Stop Blink' : 'Start Blink'}
          </button>
        </div>
        <ContainerDiv>
          <button
            className='item'
            onClick={() => {
              console.log(`Index ${currentIndex} -> ${currentIndex + 1}: x = ${x}, y = ${y}, deg = ${deg}`)
              setCurrentIndex(n => n - 1);
              setX(0);
              setY(0);
              setDeg(0);
              setEnableBlink(false);
            }}
            disabled={currentIndex <= 0}
          >
            Go Back
          </button>
          <button
            className='item'
            onClick={() => {
              console.log(`Index ${currentIndex} -> ${currentIndex + 1}: x = ${x}, y = ${y}, deg = ${deg}`)
              setCurrentIndex(n => n + 1);
              setX(0);
              setY(0);
              setDeg(0);
              setEnableBlink(false);
            }}
            disabled={currentIndex >= MAX_INDEX}
          >
            Go Next
          </button>
        </ContainerDiv>
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
