import '@fontsource/press-start-2p';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <hr style={{ borderColor: 'black', borderWidth: '2px' }} />
      <h1 
        className="pixel-font" 
        style={{ 
          fontSize: '24px', 
          fontWeight: 'normal', 
          marginBottom: '15px',
          marginTop: '15px',
          lineHeight: '1.8',
          color: 'hsl(350 80% 55%)'
        }}
      >
        CPH Food Files
      </h1>
      <p style={{ marginBottom: '20px', fontSize: '14px' }}>
        <em>✦ Fastelavnsboller i København ✦</em>
      </p>
      <hr style={{ borderColor: 'black', borderWidth: '2px' }} />
      
      <p style={{ margin: '20px 0' }}>
        <Link to="/" style={{ color: 'inherit' }}>← Back to the list</Link>
      </p>
      
      <hr />
      
      <h2 style={{ fontSize: '18px', fontWeight: 'normal', marginTop: '20px', marginBottom: '15px' }}>
        About this page
      </h2>
      
      <div style={{ lineHeight: '1.7' }}>
        <p style={{ marginBottom: '1em' }}>
          My Google Maps has so many stars and hearts I can't see the actual roads anymore. That's what happens when you live in Copenhagen and love eating out in a city where world-class restaurants open every other week.
        </p>
        
        <p style={{ marginBottom: '1em' }}>
          It started simple: 10-15 places on a sticky note. Then friends visiting Copenhagen began asking "where should we eat?" So I made a hearts list in Google Maps for places I'd actually recommend. That worked until someone asked for date night suggestions and I sent them to Mielcke & Hurtigkarl without mentioning the price. Sorry, Panas.
        </p>
        
        <p style={{ marginBottom: '1em' }}>
          The hearts list kept growing. Eventually I was making custom lists for people: brunch in Nørrebro, New Nordic that isn't Noma, fastelavnsbolle spots.
        </p>
        
        <p style={{ marginBottom: '1em' }}>
          So I started building this: a single place for all the Copenhagen restaurants I'd recommend to a friend, with proper filtering.
        </p>
        
        <p style={{ marginBottom: '1em' }}>
          I started with an MVP during fastelavnsbolle season (January-February, if you don't know what those are: puffy pastry clouds filled with cream and jam, extremely seasonal, local, and delicious). Published a bare-bones version. Got organic traffic the next day. Turns out people need this list.
        </p>
        
        <p style={{ marginBottom: '1em' }}>
          What you're looking at: Places I've been to, loved, and would send you to without hesitation. Data scraped from Google Maps every now and then. Updated manually for now. More features coming, hopefully, at some point.
        </p>
        
        <p style={{ marginBottom: '1em' }}>
          Follow my work on <a href="https://hannazoon.wordpress.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>hannazoon.wordpress.com</a>
        </p>
      </div>
      
      <hr style={{ margin: '30px 0' }} />
      
      <p style={{ fontSize: '12px', marginTop: '10px' }}>
        © 2026 CPH Food Files · Hanna Zoon
      </p>
    </div>
  );
};

export default About;
