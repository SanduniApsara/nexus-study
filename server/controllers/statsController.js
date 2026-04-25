const Module  = require('../models/Module');
const Task    = require('../models/Task');
const Session = require('../models/Session');

// GET /api/stats
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // ── Modules & GPA ─────────────────────────
    const modules = await Module.find({ user: userId });

    let totalWeightedGPA = 0;
    let totalCredits     = 0;
    const moduleStats    = [];

    modules.forEach(mod => {
      const gpa = mod.gpaPoints;
      if (gpa !== null) {
        totalWeightedGPA += gpa * mod.credits;
        totalCredits     += mod.credits;
      }
      moduleStats.push({
        id:      mod._id,
        name:    mod.name,
        code:    mod.code,
        credits: mod.credits,
        score:   mod.averageScore,
        gpa:     gpa,
        color:   mod.color,
      });
    });

    const currentGPA = totalCredits > 0
      ? Math.round((totalWeightedGPA / totalCredits) * 100) / 100
      : null;

    // ── Tasks ─────────────────────────────────
    const tasks       = await Task.find({ user: userId });
    const doneTasks   = tasks.filter(t => t.status === 'Done').length;
    const overdue     = tasks.filter(t => t.isOverdue).length;
    const upcoming    = tasks.filter(t => t.daysUntilDue >= 0 && t.daysUntilDue <= 7 && t.status !== 'Done');

    // ── Study hours ───────────────────────────
    const sessions    = await Session.find({ user: userId });
    const totalMinutes = sessions.reduce((s, sess) => s + sess.duration, 0);
    const totalHours   = Math.round(totalMinutes / 60);

    // Weekly study hours (last 7 days)
    const weeklyHours = [];
    for (let i = 6; i >= 0; i--) {
      const date  = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0,0,0,0));
      const end   = new Date(date.setHours(23,59,59,999));
      const mins  = sessions
        .filter(s => new Date(s.date) >= start && new Date(s.date) <= end)
        .reduce((sum, s) => sum + s.duration, 0);
      weeklyHours.push({
        day:   start.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: Math.round((mins / 60) * 10) / 10,
      });
    }

    res.json({
      success: true,
      data: {
        gpa: {
          current:  currentGPA,
          target:   req.user.targetGPA,
          progress: currentGPA && req.user.targetGPA
            ? Math.round((currentGPA / req.user.targetGPA) * 100)
            : 0,
        },
        modules: {
          total:   modules.length,
          stats:   moduleStats,
        },
        tasks: {
          total:    tasks.length,
          done:     doneTasks,
          overdue,
          upcoming: upcoming.length,
          upcomingList: upcoming.slice(0, 5),
        },
        study: {
          totalHours,
          weeklyHours,
          avgProductivity: sessions.length
            ? Math.round(sessions.reduce((s, sess) => s + sess.productivity, 0) / sessions.length * 10) / 10
            : 0,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats };
