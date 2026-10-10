import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pg from 'pg';

const app = express();
const port = Number(process.env.PORT || 3000);
const { Pool } = pg;
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    })
  : null;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '100kb' }));

app.get('/', (_req, res) => res.json({
  name: 'EarnLink API',
  status: 'running',
  note: 'Staging starter only; not production-ready.'
}));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'earnlink-api' }));

app.get('/ready', async (_req, res) => {
  if (!pool) return res.status(503).json({ ok: false, database: 'DATABASE_URL not configured' });
  try {
    await pool.query('SELECT 1');
    return res.json({ ok: true, database: 'connected' });
  } catch {
    return res.status(503).json({ ok: false, database: 'unavailable' });
  }
});

app.get('/api/v1/jobs', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured yet.' });
  const q = String(req.query.q || '').trim().slice(0, 100);
  const category = String(req.query.category || '').trim().slice(0, 80);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 50);
  try {
    const result = await pool.query(
      `SELECT j.id, j.title, j.description, j.pay_amount, j.currency, j.work_type,
              j.created_at, c.name AS category, j.status
       FROM jobs j LEFT JOIN job_categories c ON c.id = j.category_id
       WHERE j.status = 'published'
         AND ($1 = '' OR j.title ILIKE '%' || $1 || '%' OR j.description ILIKE '%' || $1 || '%')
         AND ($2 = '' OR c.name = $2)
       ORDER BY j.created_at DESC LIMIT $3`,
      [q, category, limit]
    );
    res.json({ jobs: result.rows });
  } catch (err) {
    console.error('jobs_list_failed', err.message);
    res.status(500).json({ error: 'Could not load jobs.' });
  }
});

app.post('/api/v1/jobs', async (req, res) => {
  // Temporary staging endpoint only. Authentication/authorization must be added before public use.
  if (!pool) return res.status(503).json({ error: 'Database is not configured yet.' });
  const title = String(req.body?.title || '').trim();
  const description = String(req.body?.description || '').trim();
  const pay = Number(req.body?.pay_amount);
  const categoryName = String(req.body?.category || 'General').trim().slice(0, 80);
  const workType = ['remote','onsite','hybrid'].includes(req.body?.work_type) ? req.body.work_type : 'remote';
  if (title.length < 5 || description.length < 20 || !Number.isFinite(pay) || pay <= 0) {
    return res.status(400).json({ error: 'Provide a title (5+ chars), description (20+ chars), and positive pay amount.' });
  }
  try {
    const category = await pool.query(
      `INSERT INTO job_categories(name) VALUES($1)
       ON CONFLICT(name) DO UPDATE SET name = EXCLUDED.name RETURNING id`, [categoryName]
    );
    const result = await pool.query(
      `INSERT INTO jobs(title, description, pay_amount, currency, work_type, category_id, status)
       VALUES($1,$2,$3,'NGN',$4,$5,'pending_review')
       RETURNING id, title, description, pay_amount, currency, work_type, status, created_at`,
      [title, description, pay, workType, category.rows[0].id]
    );
    res.status(201).json({ job: result.rows[0], message: 'Job submitted for admin review.' });
  } catch (err) {
    console.error('job_create_failed', err.message);
    res.status(500).json({ error: 'Could not create job.' });
  }
});

app.use((err, _req, res, _next) => {
  console.error('unhandled_error', err?.message || 'unknown');
  res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(port, () => console.log(`EarnLink API listening on ${port}`));
