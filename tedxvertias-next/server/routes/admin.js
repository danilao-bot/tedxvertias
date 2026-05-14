const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

const authenticate = (req, res, next) => {
  const { email, password } = req.headers;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get all registrations
router.get('/registrations', authenticate, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = supabase.from('registrations').select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const { data: all, error } = await supabase
      .from('registrations')
      .select('*');

    if (error) throw error;

    const stats = {
      total: all.length,
      byStatus: {},
      certificatesSent: all.filter(r => r.certificate_sent).length,
      certificatesPending: all.filter(r => !r.certificate_sent).length
    };

    all.forEach(r => {
      stats.byStatus[r.status] = (stats.byStatus[r.status] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete registration
router.delete('/registrations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;