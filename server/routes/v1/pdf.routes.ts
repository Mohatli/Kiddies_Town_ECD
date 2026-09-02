import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

/**
 * GET /pdf/guide
 * Generates and streams the parent guide PDF.
 */
router.get('/guide', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { generateGuidePDF } = await import('../../../src/lib/generatePdf.js');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=kiddies_town_parent_guide.pdf');
    await generateGuidePDF(res);
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to generate PDF: ' + err.message });
  }
});

export default router;
