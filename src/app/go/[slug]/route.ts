import projectsData from '@/data/projects.json';

// Live demos are hosted elsewhere (e.g. Railway). Check the demo first: if it answers, send the visitor
// straight there; if not, show our own offline page instead of the host's error.
export const dynamic = 'force-dynamic';

const CHECK_TIMEOUT_MS = 5000;

interface LiveProject {
  title: string;
  githubLink?: string;
  presentSlug?: string;
  presentContent?: string;
}

const projects = projectsData.projects as LiveProject[];

async function isUp(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
    });
    return response.status < 400;
  } catch {
    return false;
  }
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.presentSlug === params.slug && p.presentContent);
  if (!project?.presentContent) {
    return new Response('Not found', { status: 404 });
  }

  if (await isUp(project.presentContent)) {
    return new Response(null, {
      status: 307,
      headers: { Location: project.presentContent, 'Cache-Control': 'no-store' },
    });
  }

  return new Response(offlinePage(project, params.slug), {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Retry-After': '300',
    },
  });
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// A glider, drawn as a 5x5 grid of cells
const GLIDER = ['.#...', '..#..', '###..', '.....', '.....'];

function offlinePage(project: LiveProject, slug: string) {
  const title = escapeHtml(project.title);
  const cells = GLIDER.join('')
    .split('')
    .map((cell) => `<i${cell === '#' ? ' class="on"' : ''}></i>`)
    .join('');
  const github = project.githubLink
    ? `<a class="btn" href="${escapeHtml(project.githubLink)}">View the code</a>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} is offline · tanuj palaspagar</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<script>
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark');
  } catch (e) {}
</script>
<style>
  @font-face {
    font-family: 'Bricolage Grotesque';
    src: url('/fonts/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf') format('truetype-variations');
    font-weight: 100 900;
    font-stretch: 75% 125%;
    font-display: swap;
  }
  :root {
    --background: #d5d9e2;
    --card-bg: #eef0f2;
    --foreground: #404043;
    --heading: #171717;
    --muted: #6b6b70;
    --accent: #c30b4e;
    --cell: #dfe2e7;
    --shadow: -10px -10px 30px 0 #fcfcff, 10px 10px 30px 0 #b8bccc66;
  }
  html.dark {
    --background: #2c2f3e;
    --card-bg: #3a3f53;
    --foreground: #fafafd;
    --heading: #ffffff;
    --muted: #b9bccb;
    --accent: #ff90e8;
    --cell: #454a62;
    --shadow: -10px -10px 30px 0 #454a62, 10px 10px 30px 0 #0f121b;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px 16px;
    background: var(--background);
    color: var(--foreground);
    font-family: 'Bricolage Grotesque', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  main {
    width: 100%;
    max-width: 440px;
    background: var(--card-bg);
    border-radius: 16px;
    padding: 32px 28px;
    box-shadow: var(--shadow);
    text-align: center;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(5, 18px);
    gap: 4px;
    justify-content: center;
    margin: 0 auto 24px;
  }
  .grid i { width: 18px; height: 18px; border-radius: 4px; background: var(--cell); }
  .grid i.on { background: var(--accent); animation: pulse 2.4s ease-in-out infinite; }
  @keyframes pulse { 50% { opacity: 0.45; } }
  @media (prefers-reduced-motion: reduce) { .grid i.on { animation: none; } }
  h1 { margin: 0 0 8px; font-size: 1.4rem; line-height: 1.3; color: var(--heading); }
  p { margin: 0 0 24px; line-height: 1.55; color: var(--muted); }
  .actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
  .btn {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 999px;
    border: 1.5px solid var(--accent);
    color: var(--accent);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
  }
  .btn.primary { background: var(--accent); color: var(--card-bg); }
  .btn:hover { opacity: 0.85; }
  .home { display: inline-block; margin-top: 20px; color: var(--muted); font-size: 0.85rem; }
</style>
</head>
<body>
<main>
  <div class="grid" aria-hidden="true">${cells}</div>
  <h1>${title} is offline right now</h1>
  <p>The live demo isn't answering at the moment. It's usually back soon, and the code is always on GitHub.</p>
  <div class="actions">
    <a class="btn primary" href="/go/${escapeHtml(slug)}">Try again</a>
    ${github}
  </div>
  <a class="home" href="/">← Back to the portfolio</a>
</main>
</body>
</html>`;
}
