import type { Request, Response } from 'express';
import { dbQuery, parseJsonbData, getFallbackStore, saveFallbackStore, rowToEntity, entityToRow, MAPPINGS } from '../config/database';
import { createAuditLog } from '../middleware/auditLog';
import { TABLES } from '../db/tables';
import logger from '../utils/logger';
import type { AuthenticatedRequest } from '../types/index';

/**
 * POST /learners (create or update)
 * Re-implements server.ts lines 605-667.
 */
export async function createOrUpdateLearner(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const learner = req.body;

  let isUpdate = false;
  let oldLearner: any = null;

  const { result: existing } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT * FROM ${TABLES.learners} WHERE id = $1`, [learner.id]);
      if (results && results.length > 0) {
        return { found: true, data: rowToEntity(results[0], MAPPINGS.learners) };
      }
      return { found: false, data: null };
    },
    (store) => {
      const ex = store.learners.find((l: any) => l.id === learner.id);
      return { found: !!ex, data: ex || null };
    }
  );

  isUpdate = existing.found;
  oldLearner = existing.data;

  let actionType = isUpdate ? 'STUDENT_PROFILE_CHANGE' : 'CREATE_STUDENT';
  let payload: any = { id: learner.id, name: `${learner.firstNames} ${learner.surname}`, parentEmail: learner.parentEmail };

  if (oldLearner && oldLearner.attendanceStatus !== learner.attendanceStatus) {
    actionType = 'ATTENDANCE_UPDATE';
    payload = {
      id: learner.id,
      name: `${learner.firstNames} ${learner.surname}`,
      previousStatus: oldLearner.attendanceStatus || 'Pending',
      newStatus: learner.attendanceStatus,
    };
  }

  const { source } = await dbQuery(
    async (sql) => {
      const row = entityToRow(learner, MAPPINGS.learners);
      const cols = Object.keys(row);
      const vals = Object.values(row);
      const colNames = cols.join(', ');
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      const updateSets = cols.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`).join(', ');
      
      await sql.query(
        `INSERT INTO ${TABLES.learners} (${colNames}) VALUES (${placeholders}) ON CONFLICT (id) DO UPDATE SET ${updateSets}`,
        vals as any[]
      );
      return true;
    },
    (store) => {
      const index = store.learners.findIndex((l: any) => l.id === learner.id);
      if (index >= 0) {
        store.learners[index] = learner;
      } else {
        store.learners.push(learner);
      }
      saveFallbackStore();
      return true;
    }
  );

  await createAuditLog(authReq.user.email, actionType, payload);
  res.json({ success: true, usingNeon: source === 'neon' });
}

/**
 * DELETE /learners/:id
 * Re-implements server.ts lines 669-692.
 */
export async function deleteLearner(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const learnerId = req.params.id;

  const { result: deleted, source } = await dbQuery(
    async (sql) => {
      await sql.query(`DELETE FROM ${TABLES.learners} WHERE id = $1`, [learnerId]);
      return { found: true };
    },
    (store) => {
      const index = store.learners.findIndex((l: any) => l.id === learnerId);
      if (index >= 0) {
        const removed = store.learners[index] as any;
        store.learners.splice(index, 1);
        saveFallbackStore();
        return { found: true, name: `${removed.firstNames} ${removed.surname}` };
      }
      return { found: false };
    }
  );

  if (source === 'fallback' && typeof deleted === 'object' && !deleted.found) {
    res.status(404).json({ success: false, error: 'Student not found' });
    return;
  }

  const auditPayload: any = { id: learnerId };
  if (typeof deleted === 'object' && (deleted as any).name) {
    auditPayload.name = (deleted as any).name;
  }

  await createAuditLog(authReq.user.email, 'DELETE_STUDENT', auditPayload);
  res.json({ success: true, usingNeon: source === 'neon' });
}
