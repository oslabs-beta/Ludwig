import React from 'react';
import PropTypes from 'prop-types';

// Test component to demonstrate ESLint rules
function TestComponent({ title, onClick }) {
  return (
    <div>
      <h1>{title}</h1>
      {/* Missing onClick handler on clickable div */}
      <div role="button">Click me</div>
      {/* Missing alt attribute */}
      <img src="image.jpg" />
      {/* Invalid href attribute value */}
      <a href="google">Google</a>
      {/* Missing form label */}
      <form>
        <input
          type="text"
          id="name"
        />
      </form>
      {/* Using <h1> for non-top-level heading */}
      <h2>Test</h2>
      <h1>Subheading</h1>
      {/* Non-interactive element assigned an interactive role */}
      <span
        role="button"
        onClick={onClick}
      >
        Interactive span
      </span>
      {/* ARIA activedescendant without tabindex */}
      <div aria-activedescendant="some-id" />
      {/* Incorrect ARIA prop */}
      <div
        aria-hidden="true"
        aria-props="incorrect"
      />
      {/* Incorrect ARIA proptype */}
      <div aria-checked="invalid" />
      {/* Incorrect ARIA role */}
      <div role="invalid" />
      {/* Unsupported ARIA element */}
      <meta aria-hidden="true" />
      {/* Missing key events on clickable element */}
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
      {/* Missing lang attribute */}
      <html lang="" />
      {/* Media element missing captions */}
      <video src="video.mp4" />
      {/* Mouse events missing key events */}
      <div onMouseEnter={() => {}} />
      {/* Access key attribute */}
      <div accessKey="s" />
      {/* Autofocus attribute */}
      <input autoFocus />
      {/* Distracting elements */}
      <marquee>Scrolling text</marquee>
      {/* Interactive role on non-interactive element */}
      <div role="button" />
      {/* Non-interactive element with interaction handlers */}
      <div onClick={onClick} />
      {/* Non-interactive element with interactive role */}
      <div role="button" />
      {/* Non-interactive tabindex */}
      <div tabIndex="0" />
      {/* OnChange event */}
      <select onChange={() => {}} />
      {/* Redundant roles */}
      <header role="banner" />
      {/* Static element interactions */}
      <span onClick={onClick} />
      {/* Role with missing required props */}
      <input role="switch" />
      {/* Role with unsupported ARIA props */}
      <div
        role="checkbox"
        aria-level="1"
      />
      {/* Scope attribute */}
      <th scope="row" />
      {/* Positive tabindex */}
      <div tabIndex="1" />
    </div>
  );
}

TestComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TestComponent;
