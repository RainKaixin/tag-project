import {
  PenTool,
  Box,
  Gamepad,
  Award,
  Lightbulb,
  Settings,
  Star,
  Users,
  Layers,
  Handshake,
  Upload,
  Calendar,
  Hammer,
  Code,
  Globe,
  Rocket,
  Building,
  ChevronDown,
  Image,
} from 'lucide-react';
import React, { useState } from 'react';

import styles from './CoFuture2025.module.css';

const UI = {
  title: {
    prefix: 'TAGMe:',
    main: 'Co-Future',
  },
  subtitle: 'Student Competitions 2025',
  button: {
    text: 'Join the Challenge',
    href: '/tagme/co-future-2025#apply',
  },
  steps: [
    { icon: Users, text: 'Team Up' },
    { icon: Lightbulb, text: 'Co-Create' },
    { icon: Upload, text: 'Submit' },
    { icon: Award, text: 'Celebrate' },
  ],
  about: {
    title: 'About Co-Future',
    description:
      "Co-Future is TAG's official global art competition, inviting creative students from all over the world to team up and design what the future could be — together.",
    quote: '"The future is designed together."',
    features: [
      {
        title: 'Global Collaboration',
        description: 'Connect with creative minds from around the world.',
        icon: Globe,
        gradientClass: 'iconBlue',
      },
      {
        title: 'Cross-Disciplinary',
        description: 'Blend 2D, 3D, interactive media, and storytelling.',
        icon: Layers,
        gradientClass: 'iconPurple',
      },
      {
        title: 'Future-Focused',
        description: "Design innovative solutions for tomorrow's challenges.",
        icon: Rocket,
        gradientClass: 'iconBluePurple',
      },
    ],
  },
  tracks: {
    title: 'Competition Tracks',
    items: [
      {
        title: '2D Visual Design',
        description:
          'Create stunning illustrations, graphics, and visual narratives that bring the future to life.',
        icon: PenTool,
        buttonText: 'Explore Track',
        buttonColor: 'blue',
      },
      {
        title: '3D Visual Design',
        description:
          "Build immersive 3D environments, characters, and objects that define tomorrow's world.",
        icon: Box,
        buttonText: 'Explore Track',
        buttonColor: 'purple',
      },
      {
        title: 'Game & Interactive Media',
        description:
          'Design interactive experiences, games, and digital media that engage and inspire.',
        icon: Gamepad,
        buttonText: 'Explore Track',
        buttonColor: 'green',
      },
    ],
  },
  awards: {
    title: 'Awards & Recognition',
    items: [
      {
        title: 'Best Visual Presentation',
        description: 'Outstanding aesthetic quality',
        icon: Award,
        gradientClass: 'awardYellow',
      },
      {
        title: 'Best Concept Development',
        description: 'Innovative thinking and ideation',
        icon: Lightbulb,
        gradientClass: 'awardBlue',
      },
      {
        title: 'Best Technical Execution',
        description: 'Superior craftsmanship and skill',
        icon: Settings,
        gradientClass: 'awardPurple',
      },
      {
        title: 'Rising Star Award',
        description: 'Outstanding emerging talent',
        icon: Star,
        gradientClass: 'awardGreen',
      },
    ],
  },
  howToJoin: {
    title: 'How to Join',
    steps: [
      {
        number: '1',
        title: 'Build or Join a Team',
        description: 'Connect with collaborators via TAGMe platform',
        icon: Users,
      },
      {
        number: '2',
        title: 'Choose a Track',
        description: 'Select your preferred competition category',
        icon: Layers,
      },
      {
        number: '3',
        title: 'Collaborate & Co-Create',
        description: 'Work together to bring your vision to life',
        icon: Handshake,
      },
      {
        number: '4',
        title: 'Submit Your Work',
        description: 'Upload before February 10 deadline',
        icon: Upload,
      },
    ],
    ctaButton: {
      text: 'Start on TAGMe',
      href: '/tagme',
    },
  },
  timeline: {
    title: 'Competition Timeline',
    events: [
      {
        date: 'October',
        title: 'Registration Opens',
        icon: Building,
      },
      {
        date: 'November – January',
        title: 'Creation Phase',
        icon: Hammer,
      },
      {
        date: 'February 10',
        title: 'Submission Deadline',
        icon: Upload,
      },
      {
        date: 'February 20',
        title: 'Awards & Showcase',
        icon: Award,
      },
    ],
  },
  gallery: {
    title: 'Submission Gallery',
    comingSoon: 'Coming Soon',
    description:
      'This space will showcase the most inspiring submissions from each track. Check back during the creation phase to see amazing work from teams worldwide.',
  },
  faq: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Who can join?',
        answer:
          'Any student currently enrolled in an educational institution worldwide can participate.',
      },
      {
        question: 'Can I submit solo?',
        answer:
          'While we encourage collaboration, solo submissions are welcome in all tracks.',
      },
      {
        question: 'What file types are accepted?',
        answer:
          'We accept various formats including images, videos, interactive files, and project documentation.',
      },
      {
        question: 'Do I need specific software?',
        answer:
          'No, you can use any tools or software you prefer to create your submission.',
      },
      {
        question: 'How are awards judged?',
        answer:
          'Submissions are evaluated by industry professionals based on creativity, technical skill, and concept development.',
      },
    ],
  },
};

const CoFuture2025: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.titlePrefix}>{UI.title.prefix}</span>
            <span className={styles.gradientText}>{UI.title.main}</span>
          </h1>

          <p className={styles.subtitle}>{UI.subtitle}</p>

          <a
            href={UI.button.href}
            className={styles.primaryBtn}
            aria-label='Join the Co-Future challenge'
          >
            {UI.button.text}
          </a>

          <div
            className={styles.processStrip}
            aria-label='Competition process steps'
          >
            {UI.steps.map((step, index) => (
              <React.Fragment key={step.text}>
                <span className={styles.step}>
                  <span className={styles.stepIcon}>
                    <step.icon size={18} />
                  </span>
                  <span className={styles.stepText}>{step.text}</span>
                </span>
                {index < UI.steps.length - 1 && (
                  <span className={styles.stepSeparator}>•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.aboutContent}>
          <h2 className={styles.aboutTitle}>{UI.about.title}</h2>

          <p className={styles.aboutDescription}>{UI.about.description}</p>

          <blockquote className={styles.quote}>{UI.about.quote}</blockquote>

          <div className={styles.features}>
            {UI.about.features.map(feature => (
              <div key={feature.title} className={styles.feature}>
                <div
                  className={`${styles.iconCircle} ${
                    styles[feature.gradientClass]
                  }`}
                >
                  <span className={styles.featureIcon}>
                    <feature.icon size={32} />
                  </span>
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Tracks Section */}
      <section className={styles.tracks}>
        <div className={styles.tracksContent}>
          <h2 className={styles.sectionTitle}>{UI.tracks.title}</h2>
          <div className={styles.tracksGrid}>
            {UI.tracks.items.map(track => (
              <div key={track.title} className={styles.trackCard}>
                <div className={styles.trackIcon}>
                  <track.icon size={48} />
                </div>
                <h3 className={styles.trackTitle}>{track.title}</h3>
                <p className={styles.trackDescription}>{track.description}</p>
                <button
                  className={`${styles.trackButton} ${
                    styles[
                      `button${
                        track.buttonColor.charAt(0).toUpperCase() +
                        track.buttonColor.slice(1)
                      }`
                    ]
                  }`}
                >
                  {track.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition Section */}
      <section className={styles.awards}>
        <div className={styles.awardsContent}>
          <h2 className={styles.sectionTitle}>{UI.awards.title}</h2>
          <div className={styles.awardsGrid}>
            {UI.awards.items.map(award => (
              <div key={award.title} className={styles.awardItem}>
                <div
                  className={`${styles.awardIcon} ${
                    styles[award.gradientClass]
                  }`}
                >
                  <span className={styles.awardIconText}>
                    <award.icon size={24} />
                  </span>
                </div>
                <h3 className={styles.awardTitle}>{award.title}</h3>
                <p className={styles.awardDescription}>{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className={styles.howToJoin}>
        <div className={styles.howToJoinContent}>
          <h2 className={styles.sectionTitle}>{UI.howToJoin.title}</h2>
          <div className={styles.stepsGrid}>
            {UI.howToJoin.steps.map(step => (
              <div key={step.number} className={styles.stepItem}>
                <div className={styles.stepNumber}>
                  <step.icon size={20} />
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.ctaContainer}>
            <a href={UI.howToJoin.ctaButton.href} className={styles.ctaButton}>
              {UI.howToJoin.ctaButton.text}
            </a>
          </div>
        </div>
      </section>

      {/* Competition Timeline Section */}
      <section className={styles.timeline}>
        <div className={styles.timelineContent}>
          <h2 className={styles.sectionTitle}>{UI.timeline.title}</h2>
          <div className={styles.timelineContainer}>
            {UI.timeline.events.map((event, index) => (
              <div key={event.date} className={styles.timelineEvent}>
                <div className={styles.timelineIcon}>
                  <event.icon size={24} />
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineDate}>{event.date}</div>
                  <div className={styles.timelineTitle}>{event.title}</div>
                </div>
                {index < UI.timeline.events.length - 1 && (
                  <div className={styles.timelineLine} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Gallery Section */}
      <section className={styles.gallery}>
        <div className={styles.galleryContent}>
          <h2 className={styles.sectionTitle}>{UI.gallery.title}</h2>
          <div className={styles.galleryCard}>
            <div className={styles.galleryIcon}>
              <Image size={64} />
            </div>
            <h3 className={styles.galleryComingSoon}>
              {UI.gallery.comingSoon}
            </h3>
            <p className={styles.galleryDescription}>
              {UI.gallery.description}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.faqContent}>
          <h2 className={styles.sectionTitle}>{UI.faq.title}</h2>
          <div className={styles.faqList}>
            {UI.faq.items.map((item, index) => (
              <div key={index} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaqIndex === index}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    size={20}
                    className={`${styles.faqIcon} ${
                      openFaqIndex === index ? styles.faqIconRotated : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className={styles.faqAnswer}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoFuture2025;
