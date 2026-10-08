import express from 'express';

// Combined import line including Broadcast functions
import { 
  bookCounseling, 
  getCounselingSessions, 
  getExperts, 
  updateSession, 
  addAbcLog, 
  getAbcLogs,
  deleteAbcLog, 
  getChildPassport, 
  saveChildPassport,
  addVoiceLog,
  getVoiceLogs,
  deleteVoiceLog,
  toggleLowDemandMode,
  getIepRoutine,
  saveIepRoutine,
  addBroadcast, // <--- NEW
  getBroadcasts // <--- NEW
} from '../controllers/healthController.js';

const router = express.Router();

// Expert & Counseling Routes
router.get('/experts', getExperts);
router.post('/counseling/book', bookCounseling);
router.get('/counseling', getCounselingSessions);
router.put('/counseling/:id', updateSession);

// Caretaker Broadcast Routes
router.post('/broadcasts', addBroadcast); // <--- NEW ROUTE
router.get('/broadcasts', getBroadcasts); // <--- NEW ROUTE

// ABC Logger Routes
router.post('/abc-logs', addAbcLog);
router.get('/abc-logs/:parentId', getAbcLogs);
router.delete('/abc-logs/:id', deleteAbcLog);

// Child Passport & Low Demand Routes
router.get('/passport/:parentId', getChildPassport);
router.post('/passport', saveChildPassport);
router.put('/low-demand/:parentId', toggleLowDemandMode);

// IEP Routine Architect Routes
router.get('/iep-routine/:userId', getIepRoutine);
router.post('/iep-routine', saveIepRoutine);

// Voice Quick-Log Routes
router.post('/voice-logs', addVoiceLog);
router.get('/voice-logs/:parentId', getVoiceLogs);
router.delete('/voice-logs/:id', deleteVoiceLog);

export default router;