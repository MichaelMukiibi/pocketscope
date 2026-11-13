import {
  Aperture,
  ArrowRight,
  Camera,
  ClipboardCheck,
  Send,
} from 'lucide-react'
import hardware from './pocketscope.jpeg'
import './landing.css'

const steps = [
  {
    icon: Camera,
    title: 'Capture exam images',
    body: 'A health worker uses the attachment and phone camera to capture a nose or throat exam image.',
  },
  {
    icon: ClipboardCheck,
    title: 'Check image quality offline',
    body: 'The planned on-device check helps the health worker decide whether to retake the image while the patient is still there.',
  },
  {
    icon: Send,
    title: 'Share for clinician review',
    body: 'The case is saved locally and can be shared once connectivity returns.',
  },
]

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <a className="wordmark" href="/">
          <Aperture aria-hidden="true" /> PocketScope
        </a>
        <nav aria-label="Main navigation">
          <a className="nav-link" href="#workflow">
            How it works
          </a>
          <a className="nav-link" href="#prototype">
            Prototype
          </a>
        </nav>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow">PocketScope</p>
            <h1 id="hero-title">Nose and throat exams, closer to home.</h1>
            <p className="hero-description">
              PocketScope is a smartphone attachment concept that helps health
              workers capture nose and throat exam images, check image quality
              offline, and share cases for clinician review when connected.
            </p>
            <a className="hero-link" href="#workflow">
              See how it works <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <figure className="hero-visual">
            <img
              src={hardware}
              width="2528"
              height="1696"
              alt="Teal PocketScope mount clipped over a smartphone camera with a tapered exam tip"
            />
            <figcaption>Prototype concept</figcaption>
          </figure>
        </section>
        <section
          className="workflow"
          id="workflow"
          aria-labelledby="workflow-title"
        >
          <h2 id="workflow-title">How it works</h2>
          <p className="section-intro">
            For patients who live far from a regional referral hospital in
            Uganda, a specialist opinion can mean a long trip. The prototype
            explores how health workers can capture images at a local facility
            for remote review.
          </p>
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
        <section
          className="prototype"
          id="prototype"
          aria-labelledby="prototype-title"
        >
          <div>
            <h2 id="prototype-title">Prototype</h2>
            <p>
              A low-cost camera mount clips onto a smartphone. A light pipe
              guides illumination toward the exam area, and interchangeable
              disposable tips are intended for nose and throat exams.
            </p>
          </div>
          <div>
            <h3>What we aim to demonstrate</h3>
            <p>
              Capture an exam image, check its quality offline, and prepare a
              case for clinician review. On-device AI to flag specific findings
              is a future goal.
            </p>
            <a className="hero-link" href="/capture">
              Try the throat capture demo{' '}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <p className="demo-note">
              Use a training image. The demo supports local saving and a manual
              image checklist.
            </p>
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        PocketScope · Uganda mini-hackathon prototype
      </footer>
    </div>
  )
}
