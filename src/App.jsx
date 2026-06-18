import { useMemo, useState } from 'react'
import './App.css'

const dataSources = [
  { label: '시청 기록', value: '1점' },
  { label: '좋아요 영상', value: '2점' },
  { label: '구독 채널', value: '가중치' },
  { label: '자막/메타데이터', value: '수집' },
]

const videos = [
  {
    id: 'v1',
    title: 'React 상태 구조를 단순하게 만드는 실전 패턴',
    channel: 'Frontend Lab',
    category: '개발',
    format: '롱폼',
    duration: '18:42',
    score: 18,
    match: '시청 기록 + 태그 일치',
    tags: ['React', 'State', 'UI'],
    reason: '유사 주제와 반복 시청 패턴이 강하게 겹침',
    gradient: 'linear-gradient(135deg, #7c3aed, #111827)',
    watched: true,
    liked: true,
  },
  {
    id: 'v2',
    title: '유튜브 추천 알고리즘을 해석하는 방법',
    channel: 'Data Signals',
    category: '분석',
    format: '롱폼',
    duration: '21:09',
    score: 16,
    match: '좋아요 + 주제 중첩',
    tags: ['Recommendation', 'Ranking', 'Signals'],
    reason: '강추 후보군과 가장 높은 유사도',
    gradient: 'linear-gradient(135deg, #0f766e, #111827)',
    watched: true,
    liked: false,
  },
  {
    id: 'v3',
    title: '짧은 영상 소비 패턴과 집중도 변화',
    channel: 'Behavior Notes',
    category: '리서치',
    format: '숏폼',
    duration: '01:03',
    score: 12,
    match: '숏폼 반복 노출',
    tags: ['Shorts', 'Attention', 'Behavior'],
    reason: '숏폼 시청 빈도와 함께 묶어 분석하기 좋음',
    gradient: 'linear-gradient(135deg, #db2777, #111827)',
    watched: true,
    liked: false,
  },
  {
    id: 'v4',
    title: '자막 데이터로 주제 태깅 자동화하기',
    channel: 'ML Workflow',
    category: '도구',
    format: '롱폼',
    duration: '14:28',
    score: 15,
    match: '자막 키워드 일치',
    tags: ['Captions', 'NLP', 'Tags'],
    reason: '자막/설명문에서 의미 신호를 추출하기 좋음',
    gradient: 'linear-gradient(135deg, #2563eb, #111827)',
    watched: false,
    liked: true,
  },
  {
    id: 'v5',
    title: '썸네일이 클릭률에 미치는 영향',
    channel: 'Creator School',
    category: '크리에이터',
    format: '롱폼',
    duration: '09:51',
    score: 13,
    match: '추천 주제 확장',
    tags: ['Thumbnail', 'CTR', 'Growth'],
    reason: '추가 분석용 외부 인기 영상과의 비교가 쉬움',
    gradient: 'linear-gradient(135deg, #ea580c, #111827)',
    watched: false,
    liked: false,
  },
  {
    id: 'v6',
    title: '매일 기록하는 개인화 알고리즘 실험 로그',
    channel: 'Build in Public',
    category: '프로덕트',
    format: '숏폼',
    duration: '00:49',
    score: 11,
    match: '실험 루프',
    tags: ['Logging', 'Feedback', 'Iteration'],
    reason: '추천 결과를 다시 학습하는 루프 설계에 적합',
    gradient: 'linear-gradient(135deg, #16a34a, #111827)',
    watched: false,
    liked: true,
  },
]

const strongVideos = [...videos].filter((video) => video.score >= 15)
const recommendedVideos = [...videos].filter((video) => video.score < 15 && video.score >= 11)

const topTags = Object.entries(
  videos.reduce((acc, video) => {
    video.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + (video.liked ? 2 : 1)
    })
    return acc
  }, {}),
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)

function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function VideoCard({ video, selected, onSelect, onExpand }) {
  return (
    <article
      className={`video-card${selected ? ' selected' : ''}`}
      onClick={() => onSelect(video)}
      onDoubleClick={() => onExpand(video)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(video)
        }
      }}
    >
      <div className="video-thumb" style={{ background: video.gradient }}>
        <div className="thumb-overlay">
          <span>{video.category}</span>
          <strong>{video.format}</strong>
        </div>
        <div className="thumb-duration">{video.duration}</div>
      </div>

      <div className="video-body">
        <div className="video-head">
          <h3>{video.title}</h3>
          <span>{video.score} pts</span>
        </div>
        <p>{video.reason}</p>
        <div className="video-meta">
          <strong>{video.channel}</strong>
          <span>{video.match}</span>
        </div>
        <div className="tag-row">
          {video.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0])
  const [expanded, setExpanded] = useState(false)

  const stats = useMemo(
    () => [
      { label: '수집 점수 규칙', value: '시청 1 / 좋아요 2' },
      { label: '분석 대상', value: `${videos.length}개 영상` },
      { label: '강추 후보', value: `${strongVideos.length}개` },
      { label: '추천 후보', value: `${recommendedVideos.length}개` },
    ],
    [],
  )

  const activeVideo = selectedVideo || videos[0]

  return (
    <main className={`app-shell${expanded ? ' expanded' : ''}`}>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">IMU · YouTube 개인화 추천 실험</div>
          <h1>
            내 시청 기록으로
            <br />
            추천과 강추를 분리합니다.
          </h1>
          <p className="lead">
            먼저 React 페이지를 만들고, 그 위에 시청/좋아요/구독/자막 신호를 붙입니다. 지금은 목데이터로
            카드형 추천 화면과 고정 재생 패널을 먼저 확인합니다.
          </p>

          <div className="hero-actions">
            <a className="button primary" href="#library">
              카드 보기
            </a>
            <a className="button secondary" href="#analysis">
              분석 기준 보기
            </a>
          </div>
        </div>

        <aside className="hero-panel">
          <div className="panel-top">
            <span>현재 선택</span>
            <button type="button" className="ghost-button" onClick={() => setExpanded((value) => !value)}>
              {expanded ? '축소' : '확대'}
            </button>
          </div>

          <div className="player-frame">
            <div className="player-screen" style={{ background: activeVideo.gradient }}>
              <div className="player-badge">{activeVideo.format}</div>
              <div className="player-info">
                <h2>{activeVideo.title}</h2>
                <p>{activeVideo.channel}</p>
              </div>
            </div>
          </div>

          <div className="panel-meta">
            <div>
              <span>분류</span>
              <strong>{activeVideo.category}</strong>
            </div>
            <div>
              <span>점수</span>
              <strong>{activeVideo.score}</strong>
            </div>
            <div>
              <span>근거</span>
              <strong>{activeVideo.match}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="stats-grid" aria-label="분석 요약">
        {dataSources.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="stats-grid secondary" id="analysis">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="content-grid" id="library">
        <div className="column">
          <div className="section-head">
            <div>
              <span>추천 영상</span>
              <h2>점수 기반 추천</h2>
            </div>
            <p>시청 기록 1점 + 좋아요 2점 + 메타데이터 매칭</p>
          </div>

          <div className="card-list">
            {recommendedVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                selected={activeVideo.id === video.id}
                onSelect={setSelectedVideo}
                onExpand={() => setExpanded(true)}
              />
            ))}
          </div>
        </div>

        <div className="column highlight-column">
          <div className="section-head">
            <div>
              <span>강추 영상</span>
              <h2>가중치가 가장 높은 항목</h2>
            </div>
            <p>좋아요/시청/태그 중복이 강하게 겹치는 후보</p>
          </div>

          <div className="card-list strong-list">
            {strongVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                selected={activeVideo.id === video.id}
                onSelect={setSelectedVideo}
                onExpand={() => setExpanded(true)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="loop-panel">
        <div>
          <span>개인화 알고리즘 루프</span>
          <h2>시청 · 좋아요 · 재노출 · 재보정</h2>
        </div>

        <div className="tag-cloud">
          {topTags.map(([tag, count]) => (
            <span key={tag}>
              {tag} · {count}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}
