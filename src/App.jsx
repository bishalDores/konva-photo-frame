import * as React from "react";
import { Stage, Layer, Rect, Image } from "react-konva";
import { observer } from "mobx-react";
import { useStore } from "./context";
import frame1 from "./assets/frame-1.png";
import robiShape from "./assets/robi-logo-shape.png";

const downloadURI = (uri, name) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const App = () => {
  const [imageObj, setImageObj] = React.useState(null);
  const [fillColor, setFillColor] = React.useState("");
  const [downloadClicked, setDownloadClicked] = React.useState(false);
  const [frame, setFrame] = React.useState(null);
  const [shape, setShape] = React.useState(null);
  const [dragPosition, setDragPosition] = React.useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const stageRef = React.useRef();
  const transparentBackground = new window.Image();
  transparentBackground.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABlBMVEUAAADY2NjnFMi2AAAAAXRSTlMAQObYZgAAABVJREFUGNNjYIQDBgQY0oLDxBsIQQCltADJNa/7sQAAAABJRU5ErkJggg==";

  const store = useStore();
  const { win, canvas, browser, pad } = store;

  React.useEffect(() => {
    const img2 = new window.Image();
    img2.src = frame1; // replace with the actual path to your image
    img2.onload = () => {
      setFrame(img2);
    };
    const img3 = new window.Image();
    img3.src = robiShape; // replace with the actual path to your image
    img3.onload = () => {
      setShape(img3);
    };
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = handleImageLoad;
    reader.readAsDataURL(file);
  };
  const handleImageLoad = (event) => {
    const imageUrl = event.target.result;
    const image = new window.Image();
    image.src = imageUrl;
    image.onload = () => {
      setImageObj(image);
    };
  };

  const handleDragEnd = (e) => {
    setDragPosition({
      x: e.target._lastPos.x,
      y: e.target._lastPos.y,
    });
  };

  return (
    <>
      <div className="flex">
        <div id="sidebar">
          <button
            className="btn btn-primary"
            onClick={() => {
              setDownloadClicked(true);
              const options = {
                mimeType: `image/png`,
                quality: 1,
                pixelRatio: 2,
                width: 500,
                height: 500,
                x: pad / 2,
                y: (win.height - browser.height) / 2,
              };
              const img = stageRef.current?.getStage().toDataURL(options);
              downloadURI(img, "download.png");
              setDownloadClicked(false);
            }}
          >
            Download Image
          </button>
          <input type="file" onChange={handleImageUpload} className="mt-4" />
        </div>
        <Stage ref={stageRef} width={canvas.width} height={canvas.height} id="konva">
          <Layer>
            {fillColor === "" && downloadClicked && (
              <Rect
                width={browser.width + 200}
                height={browser.height + 200}
                x={pad / 2}
                y={(win.height - browser.height) / 2}
                fillPatternImage={transparentBackground}
                fill={fillColor}
              />
            )}
            {/* <Rect width={browser.width} height={browser.height} x={pad / 2} y={(win.height - browser.height) / 2} fill="papayawhip" /> */}
            <Image
              cornerRadius={300}
              x={dragPosition.x}
              y={dragPosition.y}
              width={500}
              height={500}
              image={imageObj}
              draggable={true}
              onDragStart={() => {
                console.log("dragging");
              }}
              onDragEnd={handleDragEnd}
            />
            <Image cornerRadius={300} x={pad / 2} y={(win.height - browser.height) / 2} width={500} height={500} image={frame} />
            <Image cornerRadius={300} x={pad / 2} y={(win.height - browser.height) / 2} width={500} height={500} image={shape} />
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default observer(App);
