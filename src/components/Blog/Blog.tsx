import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { publishedPosts, type BlogPost } from "../../data/posts";
import useReducedMotion from "../../hooks/useReducedMotion";
import useSound from "../../hooks/useSound";
import { inView, pick, riseChild, stagger } from "../../utils/motion";
import SectionHeader from "../ui/SectionHeader";
import "./Blog.scss";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const formatDate = (date: string) =>
  dateFormatter.format(new Date(`${date}T00:00:00Z`));

export default function Blog() {
  const reduced = useReducedMotion();
  const playClick = useSound();
  const [openPost, setOpenPost] = useState<BlogPost | null>(null);
  const closePost = useCallback(() => setOpenPost(null), []);

  return (
    <section className="blog" aria-labelledby="blog-heading">
      <span className="section-anchor" id="blog" aria-hidden="true" />

      <div className="container">
        <SectionHeader
          eyebrow="Writing"
          title="Notes from building and learning."
          description="Personal essays on software, AI, product decisions, and the lessons that do not fit in a project card."
          headingId="blog-heading"
        />

        {publishedPosts.length > 0 ? (
          <motion.ul
            className="blog__grid"
            variants={pick(stagger(0.09), reduced)}
            {...inView}
          >
            {publishedPosts.map((post, index) => (
              <motion.li
                key={post.slug}
                className={`blog__item${
                  post.featured ? " blog__item--featured" : ""
                }`}
                variants={pick(riseChild, reduced)}
              >
                {post.href ? (
                  <a
                    className="blog__card"
                    href={post.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    onMouseDown={playClick}
                    data-analytics-id={`blog-${post.slug}`}
                    data-analytics-surface="writing"
                  >
                    <CardContent post={post} index={index} external />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="blog__card"
                    onClick={() => {
                      playClick();
                      setOpenPost(post);
                    }}
                    aria-label={`Read ${post.title}`}
                    data-analytics-id={`blog-${post.slug}`}
                    data-analytics-surface="writing"
                  >
                    <CardContent post={post} index={index} />
                  </button>
                )}
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            className="blog__empty"
            variants={pick(riseChild, reduced)}
            {...inView}
          >
            <span className="blog__empty-mark" aria-hidden="true">
              Aa
            </span>
            <div>
              <h3>First essay in progress.</h3>
              <p>
                This is where I’ll share what I learn while building software,
                AI systems, and products.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <ArticleDialog post={openPost} onClose={closePost} />
    </section>
  );
}

function CardContent({
  post,
  index,
  external = false,
}: {
  post: BlogPost;
  index: number;
  external?: boolean;
}) {
  return (
    <>
      <span className="blog__cover" aria-hidden="true">
        <span className="blog__cover-number">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="blog__cover-word">Field note</span>
      </span>

      <span className="blog__body">
        <span className="blog__meta">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
        </span>
        <h3 className="blog__title">{post.title}</h3>
        <span className="blog__excerpt">{post.excerpt}</span>
        <span className="blog__tags" aria-label="Topics">
          {post.tags.map((tag) => (
            <span className="blog__tag" key={tag}>
              {tag}
            </span>
          ))}
        </span>
        <span className="blog__read">
          Read article
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={external ? "M7 17 17 7M17 7H9M17 7v8" : "M5 12h14M13 6l6 6-6 6"}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </>
  );
}

function ArticleDialog({
  post,
  onClose,
}: {
  post: BlogPost | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!post) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post && (
        <div className="article" role="presentation">
          <motion.div
            className="article__scrim"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.article
            className="article__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-title"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
            transition={
              reduced
                ? { duration: 0.15 }
                : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <button
              ref={closeRef}
              type="button"
              className="article__close"
              onClick={onClose}
              aria-label="Close article"
              data-analytics-id="article-close"
              data-analytics-surface="article-reader"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="m6 6 12 12M18 6 6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <header className="article__header">
              <div className="article__meta">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2 id="article-title">{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="article__tags" aria-label="Topics">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </header>

            <div className="article__content">
              {post.content?.map((block, index) => {
                switch (block.type) {
                  case "heading":
                    return <h3 key={index}>{block.text}</h3>;
                  case "list":
                    return (
                      <ul key={index}>
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    );
                  case "quote":
                    return <blockquote key={index}>{block.text}</blockquote>;
                  case "code":
                    return (
                      <pre key={index} data-language={block.language}>
                        <code>{block.code}</code>
                      </pre>
                    );
                  default:
                    return <p key={index}>{block.text}</p>;
                }
              })}
            </div>
          </motion.article>
        </div>
      )}
    </AnimatePresence>
  );
}
