import { PostsWorkspace } from './features/posts/PostsWorkspace'

function App() {
  return (
    <main className="grid h-screen min-h-screen items-stretch overflow-hidden p-[clamp(1rem,2vw,2rem)] text-[color:var(--shell-text)] bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(176,123,70,0.12),transparent_34%),linear-gradient(180deg,var(--shell-bg-start)_0%,var(--shell-bg-end)_100%)] [--shell-bg-start:#f6efe7] [--shell-bg-end:#ece2d3] [--shell-surface:rgba(255,252,247,0.82)] [--shell-surface-strong:#fffdf9] [--shell-border:rgba(68,49,33,0.14)] [--shell-text:#201913] [--shell-muted:#685b51] [--shell-accent:#0f766e] [--shell-accent-soft:rgba(15,118,110,0.12)] [--shell-shadow:0_32px_90px_rgba(44,26,12,0.12)] [--shell-radius-xl:32px] [--shell-radius-lg:24px] [--shell-radius-md:18px]">
      <PostsWorkspace />
    </main>
  )
}

export default App
