import { Router } from 'express';
import { getDivisionData, availableDivisions } from '../services/divisionDataService';

const router = Router();

// Get NASA data for any division
router.get('/:division', async (req, res) => {
  const { division } = req.params;
  
  // Validate division parameter
  if (!availableDivisions.includes(division.toLowerCase() as any)) {
    return res.status(404).json({ 
      error: `Division ${division} not found. Available divisions: ${availableDivisions.join(', ')}`
    });
  }

  try {
    const data = await getDivisionData(division.toLowerCase() as any);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${division} data:`, error);
    res.status(500).json({ 
      error: `Failed to fetch NASA data for ${division}`,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Keep the original Rajshahi route for backward compatibility
// router.get('/rajshahi', async (req, res) => {
//   try {
//     const data = await getDivisionData('rajshahi');
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching Rajshahi data:', error);
//     res.status(500).json({ 
//       error: 'Failed to fetch NASA data for Rajshahi',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

export default router;