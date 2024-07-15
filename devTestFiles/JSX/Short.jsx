import React from 'react';

function ShortTest() {
  return (
    <div>
      <h1>Short Test</h1>
      <img src="image.jpg" />
      <div
        onClick={() => {}}
        role="button"
      >
        Click me
      </div>
      sing onClick handler on clickable div */ sing key events on clickable element */
      <div onClick={onClick} />
      {/* Heading with no content */}
      <h2 />
      {/* HTML element without lang attribute */}
      <html />
      {/* Iframe without title */}
      <iframe src="some-source" />
      {/* Redundant alt text */}
      <img
        src="image.jpg"
        alt="Image of an image"
      />
      {/* Interactive element missing focus */}
      <a href="https://example.com" />
      {/* Label missing associated control */}
      <label>Missing control</label>
      <a href="#">Empty link</a>
      <a href="#">Empty link</a>
      <a href="#">Empty link</a>
    </div>
  );
}

export default ShortTest;
