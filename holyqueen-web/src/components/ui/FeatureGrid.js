export default function FeatureGrid({ items, numbered }) {
  return (
    <div className="feature-grid">
      {items.map((item, index) => {
        const title = typeof item === "string" ? item : item.title;
        const body = typeof item === "string" ? null : item.body;
        return (
          <article className="feature-card reveal" key={title}>
            {numbered && (
              <span className="panel-icon">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <h3>{title}</h3>
            {body && <p>{body}</p>}
          </article>
        );
      })}
    </div>
  );
}
