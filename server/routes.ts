import { Router } from 'express';
import { getDivisionData, availableDivisions, getRajshahiData } from './services/divisionDataService';

const router = Router();

// Get data for any division
router.get('/:division', async (req, res) => {
  try {
    const { division } = req.params;
    const divisionLower = division.toLowerCase();

    // Validate division parameter
    if (!availableDivisions.includes(divisionLower as any)) {
      return res.status(400).json({ 
        error: 'Invalid division',
        message: `Division '${division}' not found. Available divisions: ${availableDivisions.join(', ')}`
      });
    }

    const data = await getDivisionData(divisionLower as any);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching data for division ${req.params.division}:`, error);
    res.status(500).json({ 
      error: `Failed to fetch NASA data for ${req.params.division}`,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Keep backward compatibility for Rajshahi specific route
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

// Optional: Get list of available divisions
router.get('/', async (req, res) => {
  try {
    res.json({
      availableDivisions,
      message: `Use /api/nasa-data/:division where division is one of: ${availableDivisions.join(', ')}`
    });
  } catch (error) {
    console.error('Error fetching division list:', error);
    res.status(500).json({ 
      error: 'Failed to fetch division list',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;