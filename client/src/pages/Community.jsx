const topicCards = [
  { title: "Training Tips", posts: "2.3k posts", tone: "blue" },
  { title: "Health and Nutrition", posts: "5.1k posts", tone: "green" },
  { title: "Adoption Stories", posts: "1.8k posts", tone: "pink" },
  { title: "Lost and Found", posts: "892 posts", tone: "orange" },
];

const feed = [
  {
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    tag: "Premium",
    time: "2 hours ago",
    text: "Just adopted this little guy. Any tips for first-time golden retriever parents?",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    likes: 234,
    comments: 45,
  },
  {
    author: "Dr. Mehta",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80",
    tag: "Verified Vet",
    time: "5 hours ago",
    text: "Quick Tip: Regular dental care is crucial. Brush your pet's teeth 3x a week to prevent dental disease.",
    image: "",
    likes: 567,
    comments: 89,
  },
  {
    author: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    tag: "",
    time: "1 day ago",
    text: "Luna's birthday celebration. She turned 3 today.",
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80",
    likes: 493,
    comments: 123,
  },
];

export default function Community() {
  return (
    <div className="care-page community-page">
      <header className="page-hero hot">
        <div>
          <h1>Community</h1>
          <p>Connect with 50K+ pet parents</p>
        </div>
        <button className="round-add-button">+</button>
      </header>

      <section className="community-stats">
        <article className="community-stat-card">
          <strong>52K</strong>
          <span>Members</span>
        </article>
        <article className="community-stat-card">
          <strong>8.9K</strong>
          <span>Posts</span>
        </article>
        <article className="community-stat-card">
          <strong>1.2K</strong>
          <span>Today</span>
        </article>
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <h2>Popular Topics</h2>
        </div>
        <div className="topic-grid">
          {topicCards.map((topic) => (
            <article key={topic.title} className="topic-card">
              <div className={`feature-icon ${topic.tone}`}>{topic.title.slice(0, 1)}</div>
              <div>
                <strong>{topic.title}</strong>
                <p>{topic.posts}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="community-feed">
        {feed.map((post) => (
          <article key={`${post.author}-${post.time}`} className="post-card">
            <div className="post-head">
              <img src={post.avatar} alt={post.author} className="post-avatar" />
              <div>
                <strong>{post.author}</strong>
                {post.tag ? <span className="mini-badge">{post.tag}</span> : null}
                <p>{post.time}</p>
              </div>
            </div>
            <p className="post-copy">{post.text}</p>
            {post.image ? <img src={post.image} alt={post.author} className="post-image" /> : null}
            <div className="post-actions">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
              <button>Share</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

