import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <h1>Welcome to Our Website</h1>
        </header>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <main>
          <section id="home">
            <h2>Home</h2>
            <img src="image.jpg" alt="" />
            <button onClick={() => alert('Hello!')}>Click me</button>
          </section>
          <section id="about">
            <h2>About Us</h2>
            <p>Our company was founded in <strong>2020</strong>.</p>
            <div tabIndex="0">Focusable div</div>
            <form>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" />
              <input type="submit" value="Submit" />
            </form>
          </section>
          <section id="services">
            <h2>Services</h2>
            <ul>
              <li>Service 1</li>
              <li>Service 2</li>
              <li>Service 3</li>
            </ul>
            <div className="clickable" onClick={() => alert('Clicked!')}>Clickable div</div>
          </section>
          <section id="contact">
            <h2>Contact Us</h2>
            <form>
              <label>Email</label>
              <input type="email" id="email" />
              <button>Submit</button>
            </form>
          </section>
          <section id="extra">
            <h2>Extra Section</h2>
            <img src="extra.jpg" alt="Extra Image" />
            <button onClick={() => alert('Extra')}>Extra Button</button>
            <div role="button" tabIndex="0">Fake Button</div>
            <form>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" />
              <input type="submit" value="Submit Password" />
            </form>
          </section>
          <section id="team">
            <h2>Our Team</h2>
            <img src="team.jpg" alt="" />
            <button onClick={() => alert('Meet the Team')}>Meet the Team</button>
            <div tabIndex="0">Team Focus</div>
          </section>
          <section id="careers">
            <h2>Careers</h2>
            <p>Join our team of professionals and enjoy a rewarding career!</p>
            <div className="clickable" onClick={() => alert('Career Clicked!')}>Clickable Career</div>
            <form>
              <label htmlFor="apply">Apply Now</label>
              <input type="text" id="apply" />
              <input type="submit" value="Apply" />
            </form>
          </section>
          <section id="products">
            <h2>Our Products</h2>
            <ul>
              <li>Product 1</li>
              <li>Product 2</li>
              <li>Product 3</li>
            </ul>
            <img src="product.jpg" alt="" />
            <button onClick={() => alert('Product Info')}>Product Info</button>
          </section>
          <section id="testimonials">
            <h2>Testimonials</h2>
            <p>Read what our clients have to say about us.</p>
            <div className="clickable" onClick={() => alert('Testimonial Clicked!')}>Clickable Testimonial</div>
          </section>
          <section id="blog">
            <h2>Our Blog</h2>
            <p>Stay updated with the latest news and articles from our team.</p>
            <div tabIndex="0">Focusable Blog</div>
            <form>
              <label htmlFor="subscribe">Subscribe</label>
              <input type="email" id="subscribe" />
              <input type="submit" value="Subscribe" />
            </form>
          </section>
          <section id="gallery">
            <h2>Gallery</h2>
            <img src="gallery.jpg" alt="" />
            <button onClick={() => alert('View Gallery')}>View Gallery</button>
            <div tabIndex="0">Gallery Focus</div>
          </section>
          <section id="faq">
            <h2>FAQ</h2>
            <p>Frequently Asked Questions</p>
            <div className="clickable" onClick={() => alert('FAQ Clicked!')}>Clickable FAQ</div>
          </section>
          <section id="contact-info">
            <h2>Contact Information</h2>
            <form>
              <label htmlFor="phone">Phone Number</label>
              <input type="text" id="phone" />
              <input type="submit" value="Submit" />
            </form>
            <div className="clickable" onClick={() => alert('Contact Clicked!')}>Clickable Contact</div>
          </section>
        </main>
        <footer>
          <p>&copy; 2023 Company Name</p>
        </footer>
      </div>
    );
  }
}

export default App;
