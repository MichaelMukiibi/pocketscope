import {
  Aperture,
  ArrowRight,
  Camera,
  ClipboardCheck,
  WifiOff,
} from 'lucide-react'
import './landing.css'

const steps = [
  {
    icon: Camera,
    title: 'Capture',
    body: 'Take a throat photo with your phone or select a training image.',
  },
  {
    icon: ClipboardCheck,
    title: 'Check the view',
    body: 'Use the checklist to confirm the throat is visible, well lit, and in focus.',
  },
  {
    icon: WifiOff,
    title: 'Save on the device',
    body: 'Keep the capture on the phone, even if connectivity drops while the app is open.',
  },
]

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <a className="wordmark" href="/">
          <Aperture aria-hidden="true" /> PocketScope
        </a>
        <a className="nav-link" href="#workflow">
          How it works
        </a>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Throat screening prototype</p>
            <h1 id="hero-title">A clearer view of the throat.</h1>
            <p className="hero-description">
              PocketScope helps health workers capture and save throat images on
              a phone, even when the connection drops.
            </p>
            <a className="hero-link" href="/capture">
              Try the capture demo <ArrowRight size={18} aria-hidden="true" />
            </a>
            <p className="demo-note">Use a training image to try the demo.</p>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="device">
              <span className="device-title">
                <Aperture size={16} /> Throat capture
              </span>
              <div className="device-view">
                <Camera size={42} strokeWidth={1.3} />
              </div>
              <span className="device-shutter" />
            </div>
          </div>
        </section>
        <section
          className="workflow"
          id="workflow"
          aria-labelledby="workflow-title"
        >
          <h2 id="workflow-title">How the demo works</h2>
          <ol>
            {steps.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <Icon aria-hidden="true" size={24} />
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  )
}
