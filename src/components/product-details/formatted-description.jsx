import React from "react";

const EMPTY_SECTIONS = [];

const normalizeText = (value) =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .trim();

const enrichBreaks = (value) =>
  value
    .replace(/([.!?])\s+([A-Z][A-Za-z0-9'&()/\- ]{2,42}:)/g, "$1\n$2")
    .replace(/\s+(?:•|-)\s+/g, "\n- ")
    .replace(/\s+([0-9]{1,2}[.)]\s+)/g, "\n$1");

const isLikelyHeading = (line) => {
  const text = String(line || "").trim();
  if (!text.endsWith(":")) return false;
  if (text.length > 60) return false;
  return /^[A-Z][A-Za-z0-9'&()/\- ]+:$/.test(text);
};

export const parseProductDescription = (rawText) => {
  const normalized = normalizeText(rawText);
  if (!normalized) return EMPTY_SECTIONS;

  const lines = enrichBreaks(normalized)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return EMPTY_SECTIONS;

  const sections = [];
  let active = { title: "Product Overview", paragraphs: [], bullets: [], steps: [] };

  const pushActive = () => {
    if (active.paragraphs.length || active.bullets.length || active.steps.length) {
      sections.push(active);
    }
  };

  lines.forEach((line) => {
    if (isLikelyHeading(line)) {
      pushActive();
      active = {
        title: line.slice(0, -1),
        paragraphs: [],
        bullets: [],
        steps: [],
      };
      return;
    }

    const headingWithBody = line.match(/^([A-Z][A-Za-z0-9'&()/\- ]{2,42}):\s*(.+)$/);
    if (headingWithBody) {
      pushActive();
      active = {
        title: headingWithBody[1],
        paragraphs: [headingWithBody[2]],
        bullets: [],
        steps: [],
      };
      return;
    }

    const bullet = line.match(/^[-*•]\s+(.+)$/);
    if (bullet) {
      active.bullets.push(bullet[1]);
      return;
    }

    const step = line.match(/^[0-9]{1,2}[.)]\s+(.+)$/);
    if (step) {
      active.steps.push(step[1]);
      return;
    }

    active.paragraphs.push(line);
  });

  pushActive();

  return sections.filter(
    (section) =>
      section.paragraphs.length > 0 || section.bullets.length > 0 || section.steps.length > 0
  );
};

const cloneSection = (section) => ({
  title: section.title,
  paragraphs: [...section.paragraphs],
  bullets: [...section.bullets],
  steps: [...section.steps],
});

export const getDescriptionPreviewSections = (sections) => {
  if (!Array.isArray(sections) || sections.length === 0) return EMPTY_SECTIONS;

  const first = cloneSection(sections[0]);
  first.paragraphs = first.paragraphs.slice(0, 1);
  first.bullets = first.bullets.slice(0, 4);
  first.steps = first.steps.slice(0, 3);

  return [first];
};

const FormattedDescription = ({ sections, compact = false }) => {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return (
    <div className={`aura-description-blocks ${compact ? "is-compact" : ""}`}>
      {sections.map((section, index) => (
        <section key={`${section.title}-${index}`} className="aura-description-section">
          {section.title ? <h4 className="aura-description-title">{section.title}</h4> : null}

          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={`p-${paragraphIndex}`} className="aura-description-text">
              {paragraph}
            </p>
          ))}

          {section.bullets.length > 0 ? (
            <ul className="aura-description-list">
              {section.bullets.map((item, bulletIndex) => (
                <li key={`b-${bulletIndex}`}>{item}</li>
              ))}
            </ul>
          ) : null}

          {section.steps.length > 0 ? (
            <ol className="aura-description-list aura-description-list--ordered">
              {section.steps.map((item, stepIndex) => (
                <li key={`s-${stepIndex}`}>{item}</li>
              ))}
            </ol>
          ) : null}
        </section>
      ))}
    </div>
  );
};

export default FormattedDescription;
