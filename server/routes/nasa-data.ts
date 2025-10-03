import { Router } from 'express';
import { getRajshahiData } from '../services/rajshahiDataService';

const router = Router();

// Get Rajshahi NASA data
router.get('/rajshahi', async (req, res) => {
  try {
    const data = await getRajshahiData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Rajshahi data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch NASA data for Rajshahi',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
