import React from 'react';
import PropTypes from 'prop-types';
function LongTestSingleError({ title, onButtonClick }) {
  return (
    <div lang="en">
      <h1>{title}</h1>
      <p>This is a long test component with only one accessibility error.</p>
      <button onClick="{onButtonClick}">Click me</button>
      <img
        src="valid-image.jpg"
        alt="A valid image"
      />
      <a href="https://example.com">Valid link</a>
      <form>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
        />
      </form>
      <h2>Subsection</h2>
      <p>This is a subsection of the component.</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
      </ul>
      <div
        role="region"
        aria-label="Additional information"
      >
        <p>This is a region with additional information.</p>
      </div>
      <section>
        <h2>Another section</h2>
        <p>This section contains more content.</p>
      </section>
      <footer>
        <p>Footer content</p>
        {/* The only accessibility error in this component: */}
        <img src="footer-image.jpg" />
      </footer>
    </div>
  );
}
LongTestSingleError.propTypes = { title: PropTypes.string.isRequired, onButtonClick: PropTypes.func.isRequired };
export default LongTestSingleError;
