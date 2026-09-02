import type { Request, Response } from 'express';
import { dbQuery, saveFallbackStore, entityToRow, MAPPINGS } from '../config/database';
import type { FallbackStore } from '../config/database';
import { createAuditLog } from '../middleware/auditLog';
import type { AuthenticatedRequest } from '../types/index';
import { TABLES } from '../db/tables';

const TABLE_TO_MAPPING_KEY: Record<string, keyof typeof MAPPINGS> = {
  [TABLES.parentProfile]: 'parentProfile',
  [TABLES.reports]: 'reports',
  [TABLES.chats]: 'chats',
  [TABLES.themes]: 'themes',
  [TABLES.events]: 'events',
  [TABLES.journal]: 'journal',
  [TABLES.enrolments]: 'enrolments',
};

interface UpsertOptions {
  table: string;
  getId: (data: any) => string;
  auditAction: string;
  auditPayload?: (data: any) => Record<string, unknown>;
  storeKey: keyof FallbackStore;
}

export function createUpsertHandler(options: UpsertOptions) {
  return async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const data = req.body;
    
    // For parent profiles target email check
    let id = options.getId(data);
    if (options.storeKey === 'parentProfiles' && authReq.user.role === 'parent') {
      id = authReq.user.email.toLowerCase().trim();
    }

    const { source } = await dbQuery(
      async (sql) => {
        const mappingKey = TABLE_TO_MAPPING_KEY[options.table] as keyof typeof MAPPINGS;
        const row = entityToRow(data, MAPPINGS[mappingKey]);
        const cols = Object.keys(row);
        const vals = Object.values(row);
        
        const colNames = cols.join(', ');
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
        const pk = options.table === TABLES.themes ? 'week_no' : 'id';
        const updateSets = cols.filter(c => c !== pk).map(col => `${col} = EXCLUDED.${col}`).join(', ');
        
        const query = updateSets.length > 0 
          ? `INSERT INTO ${options.table} (${colNames}) VALUES (${placeholders}) ON CONFLICT (${pk}) DO UPDATE SET ${updateSets}`
          : `INSERT INTO ${options.table} (${colNames}) VALUES (${placeholders}) ON CONFLICT (${pk}) DO NOTHING`;

        await (sql as any).query(query, vals as any[]);
        return true;
      },
      (store) => {
        const storeTarget = store[options.storeKey];
        if (Array.isArray(storeTarget)) {
          const index = storeTarget.findIndex((item: any) => (item.id === id) || (item.weekNo === id));
          if (index >= 0) {
            storeTarget[index] = data;
          } else {
            // Note: chatHistory array isn't pushed to in the same way, but let's see. 
            // In original code, chats did store.chatHistory = [...store.chatHistory, chatMessage];
            // themes did store.themes = [theme, ...store.themes];
            // Let's just push or unshift based on what they did, or just push. 
            // Actually, for themes/journalPosts/enrolments they did unshift (pre-pend).
            if (options.storeKey === 'themes' || options.storeKey === 'journalPosts' || options.storeKey === 'enrolments') {
              (store[options.storeKey] as any).unshift(data);
            } else {
              storeTarget.push(data);
            }
          }
        } else {
          // Object maps (parentProfiles)
          if (!store[options.storeKey]) (store[options.storeKey] as any) = {};
          (store[options.storeKey] as any)[id] = data;
        }
        saveFallbackStore();
        return true;
      }
    );

    if (options.auditAction) {
      const payload = options.auditPayload ? options.auditPayload(data) : { id };
      const operator = authReq.user?.email || 'guest';
      await createAuditLog(operator, options.auditAction, payload);
    } else {
      // In saveChat there is no audit log
    }
    
    res.json({ success: true, usingNeon: source === 'neon' });
  };
}
