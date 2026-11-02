export default function PageHeading({ number, eyebrow, title, description }) {
  return <header className="page-heading"><div className="section-kicker"><span>{number}</span><span>{eyebrow}</span></div><h1>{title}</h1>{description && <p>{description}</p>}</header>;
}
