import React from 'react';

function LongTest() {
  return (
    <div>
      <h1>Long Test with Multiple Errors</h1>
      
      <span role="button">Non-interactive button</span>
      <div onMouseEnter={() => {}}>Mouse event only</div>
      <marquee>Distracting element</marquee>
      <div tabIndex="1">Positive tabindex</div>
      <html>
        <body>
          <h1>Missing lang attribute</h1>
        </body>
      </html>
      <iframe src="https://example.com"></iframe>
    
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
      <h1>Incorrect heading level</h1>
      <h3>Should be h2</h3>
      <div aria-activedescendant="some-id">Missing tabindex</div>
      <header role="banner">Redundant role</header>
    </div>
  );
}

export default LongTest;