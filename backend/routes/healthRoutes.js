import express from 'express';
import { bookCounseling, getCounselingSessions, getExperts, updateSession, getAbcLogs, addAbcLog } from '../controllers/healthController.js';
const router = express.Router();

// Raj's requested GET route for experts
router.get('/experts', getExperts);

// Raj's requested POST route for booking
router.post('/counseling/book', bookCounseling);

// Keeping these for the Admin Caseload Calendar
router.get('/counseling', getCounselingSessions);
router.put('/counseling/:id', updateSession);

// Add these two new routes
router.get('/abc-logs', getAbcLogs);
router.post('/abc-logs', addAbcLog);
export default router;