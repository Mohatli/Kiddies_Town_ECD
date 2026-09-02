import type { Request, Response } from 'express';
import { dbQuery, parseJsonbData, isNeonActive, getSqlConnection, getFallbackStore, saveFallbackStore, rowToEntity, MAPPINGS } from '../config/database';
import { TABLES } from '../db/tables';
import logger from '../utils/logger';
import type { AuthenticatedRequest } from '../types/index';
import { initialParentProfiles } from '../../src/data/mockData';

/**
 * GET /data (equivalent to GET /api/all-data)
 * Returns all active dashboard collections. Preserves ALL filtering logic:
 * - Guest mode: only public data (themes, events, journal)
 * - Parent filtering: learners, reports, payments, chats scoped to parent email
 * - Teacher/Admin: global view of everything
 *
 * Re-implements server.ts lines 372-601.
 */
export async function getAllData(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const userEmail = authReq.user.email.toLowerCase().trim();
  const userRole = authReq.user.role;

  // Serialize once; reuse the exact bytes for both ETag and body.
  const sendWithEtag = (payload: unknown): void => {
    const json = JSON.stringify(payload);
    const etag = `W/"${Buffer.byteLength(json)}"`;
    res.set('ETag', etag);
    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }
    res.type('application/json').send(json);
  };

  // --- Guest mode: only public data ---
  if (userRole === 'guest') {
    const { result: guestData } = await dbQuery(
      async (sql) => {
        const dbThemes = await sql.query(`SELECT * FROM ${TABLES.themes}`);
        const dbEvents = await sql.query(`SELECT * FROM ${TABLES.events}`);
        const dbJournal = await sql.query(`SELECT * FROM ${TABLES.journal}`);
        return {
          themes: dbThemes.map((r: any) => rowToEntity(r, MAPPINGS.themes)).sort((a: any, b: any) => a.weekNo - b.weekNo),
          events: dbEvents.map((r: any) => rowToEntity(r, MAPPINGS.events)),
          journalPosts: dbJournal.map((r: any) => rowToEntity(r, MAPPINGS.journal)),
        };
      },
      (store) => ({
        themes: store.themes,
        events: store.events,
        journalPosts: store.journalPosts,
      })
    );

    const responseData = {
      learners: [],
      parentProfile: null,
      progressReports: [],
      paymentHistory: [],
      chatHistory: [],
      themes: guestData.themes,
      events: guestData.events,
      journalPosts: guestData.journalPosts,
      enrolments: [],
      parentProfiles: [],
      registers: [],
      usingNeon: isNeonActive(),
    };

    sendWithEtag(responseData);
    return;
  }

  // --- Authenticated user: fetch all collections ---
  let learnersList: any[] = [];
  let parentProfileObj: any = null;
  let progressReportsList: any[] = [];
  let paymentHistoryList: any[] = [];
  let chatHistoryList: any[] = [];
  let themesList: any[] = [];
  let eventsList: any[] = [];
  let journalPostsList: any[] = [];
  let enrolmentsList: any[] = [];
  let registersList: any[] = [];

  const { result: mainData, source } = await dbQuery(
    async (sql) => {
      // Single round-trip batch: all collections in parallel.
      const [dbLearners, dbReports, dbPayments, dbChats, dbThemes, dbEvents, dbJournal, dbEnrolments, dbRegisters] = await Promise.all([
        sql.query(`SELECT * FROM ${TABLES.learners}`),
        sql.query(`SELECT * FROM ${TABLES.reports}`),
        sql.query(`SELECT * FROM ${TABLES.payments}`),
        sql.query(`SELECT * FROM ${TABLES.chats}`),
        sql.query(`SELECT * FROM ${TABLES.themes}`),
        sql.query(`SELECT * FROM ${TABLES.events}`),
        sql.query(`SELECT * FROM ${TABLES.journal}`),
        sql.query(`SELECT * FROM ${TABLES.enrolments}`),
        sql.query(`SELECT id, data FROM ${TABLES.registers}`).catch(() => [] as any[]),
      ]);

      const data = {
        learners: dbLearners.map((r: any) => rowToEntity(r, MAPPINGS.learners)),
        reports: dbReports.map((r: any) => rowToEntity(r, MAPPINGS.reports)),
        payments: dbPayments.map((r: any) => rowToEntity(r, MAPPINGS.payments)),
        chats: dbChats.map((r: any) => rowToEntity(r, MAPPINGS.chats)),
        themes: dbThemes.map((r: any) => rowToEntity(r, MAPPINGS.themes)).sort((a: any, b: any) => a.weekNo - b.weekNo),
        events: dbEvents.map((r: any) => rowToEntity(r, MAPPINGS.events)),
        journal: dbJournal.map((r: any) => rowToEntity(r, MAPPINGS.journal)),
        enrolments: dbEnrolments.map((r: any) => rowToEntity(r, MAPPINGS.enrolments)),
        registers: dbRegisters.map((r: any) => (typeof r.data === 'string' ? JSON.parse(r.data) : r.data)),
        parentProfile: null as any,
      };

      // Fetch parent profile
      if (userRole === 'parent' && userEmail) {
        const dbProfile = await sql.query(`SELECT * FROM ${TABLES.parentProfile} WHERE id = $1`, [userEmail]);
        if (dbProfile && dbProfile.length > 0) {
          data.parentProfile = rowToEntity(dbProfile[0], MAPPINGS.parentProfile);
        } else {
          const dbDefaultProfile = await sql.query(`SELECT * FROM ${TABLES.parentProfile} WHERE id = $1`, ['default']);
          data.parentProfile = dbDefaultProfile[0] ? rowToEntity(dbDefaultProfile[0], MAPPINGS.parentProfile) : null;
        }
      } else {
        const dbProfile = await sql.query(`SELECT * FROM ${TABLES.parentProfile} WHERE id = $1`, ['default']);
        data.parentProfile = dbProfile[0] ? rowToEntity(dbProfile[0], MAPPINGS.parentProfile) : null;
      }

      return data;
    },
    (store) => {
      let profile: any = null;
      if (userRole === 'parent' && userEmail) {
        profile = (store.parentProfiles as any)?.[userEmail] || store.parentProfile;
      } else {
        profile = store.parentProfile;
      }
      return {
        learners: store.learners,
        reports: store.progressReports,
        payments: store.paymentHistory,
        chats: store.chatHistory,
        themes: store.themes,
        events: store.events,
        journal: store.journalPosts,
        enrolments: store.enrolments,
        registers: (store as any).registers || [],
        parentProfile: profile,
      };
    }
  );

  learnersList = mainData.learners;
  progressReportsList = mainData.reports;
  paymentHistoryList = mainData.payments;
  chatHistoryList = mainData.chats;
  themesList = mainData.themes;
  eventsList = mainData.events;
  journalPostsList = mainData.journal;
  enrolmentsList = mainData.enrolments;
  registersList = mainData.registers || [];
  parentProfileObj = mainData.parentProfile;

  // --- Fetch all parent profiles ---
  const { result: allParentProfiles } = await dbQuery(
    async (sql) => {
      const dbProfiles = await sql.query(`SELECT * FROM ${TABLES.parentProfile}`);
      return dbProfiles.map((r: any) => {
        const p = rowToEntity(r, MAPPINGS.parentProfile);
        return {
          email: r.id === 'default' ? 'parent@kiddiestown.co.za' : r.id,
          name: (p as any).name || ((p as any).mother?.firstNames ? ((p as any).mother.firstNames + ' ' + (p as any).mother.surname) : r.id),
          profile: p,
        };
      });
    },
    (store) => {
      return Object.entries(store.parentProfiles || {}).map(([email, p]: [string, any]) => ({
        email: email,
        name: p.name || (p.mother?.firstNames ? (p.mother.firstNames + ' ' + p.mother.surname) : email),
        profile: p,
      }));
    }
  );

  // Deduplicate and filter out "default" key
  const parentMap = new Map<string, any>();
  allParentProfiles.forEach((p: any) => {
    if (p.email !== 'default') {
      parentMap.set(p.email.toLowerCase().trim(), p);
    }
  });

  // Ensure we always have the ones from initialParentProfiles
  Object.entries(initialParentProfiles).forEach(([email, p]: [string, any]) => {
    const semail = email.toLowerCase().trim();
    if (!parentMap.has(semail)) {
      parentMap.set(semail, { email: semail, name: p.name, profile: p });
    } else {
      const existing = parentMap.get(semail);
      if (!existing.profile) {
        existing.profile = p;
      }
    }
  });
  const finalParentList = Array.from(parentMap.values());

  // --- Parent filtering (lines 538-586) ---
  if (userRole === 'parent' && userEmail) {
    const isDemoParent = userEmail === 'parent@kiddiestown.co.za';

    // 1. Filter Learners - only return matched learners, except for the default demo account
    const filteredLearners = learnersList.filter(
      (l: any) => l.parentEmail === userEmail || (isDemoParent && (l.id === 'student-jake' || l.id === 'student-jill'))
    );

    // 2. Filter Reports - return reports only for matched children
    const myLearnerIds = filteredLearners.map((l: any) => l.id);
    const filteredReports = progressReportsList.filter((r: any) => myLearnerIds.includes(r.learnerId));

    // 3. Filter Payments - return outstanding payments only for matched children/parents
    const filteredPayments = paymentHistoryList.filter(
      (p: any) =>
        p.parentEmail === userEmail ||
        myLearnerIds.includes(p.learnerId) ||
        (isDemoParent && (p.learnerId === 'student-jake' || p.learnerId === 'student-jill'))
    );

    // 4. Filter chats
    let filteredChats = chatHistoryList.filter((c: any) => c.parentEmail === userEmail);

    // Auto-inject direct introduction when a newly registered parent enters chat the first time
    if (filteredChats.length === 0 && userEmail !== 'parent@kiddiestown.co.za') {
      const welcomeChat = {
        id: 'chat-welcome-' + Date.now(),
        sender: 'Teacher',
        senderName: 'Teacher Anne',
        text: `Hello! 👋 Welcome to your Kiddies Town Parent Portal. This is a direct, confidential communication line to Teacher Anne. Please let us know if you have any questions about daily classroom schedules or lesson plans!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        parentEmail: userEmail,
      };
      filteredChats = [welcomeChat];

      // Persist the welcome chat
      await dbQuery(
        async (sql) => {
          await sql.query(
            `INSERT INTO ${TABLES.chats} (id, sender, sender_name, text, timestamp, parent_email) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
            [welcomeChat.id, welcomeChat.sender, welcomeChat.senderName, welcomeChat.text, welcomeChat.timestamp, userEmail]
          );
        },
        (store) => {
          store.chatHistory.push(welcomeChat as any);
        }
      );
    }

    const responseData = {
      learners: filteredLearners,
      parentProfile: parentProfileObj,
      progressReports: filteredReports,
      paymentHistory: filteredPayments,
      chatHistory: filteredChats,
      themes: themesList,
      events: eventsList,
      journalPosts: journalPostsList,
      enrolments: enrolmentsList,
      // POPIA minimality: parents may only see their own household profile,
      // never the directory-wide list (admin surfaces only).
      parentProfiles: finalParentList.filter((p: any) => p.email === userEmail),
      usingNeon: isNeonActive(),
    };

    sendWithEtag(responseData);
    return;
  }

  // --- Teacher / Admin gets global view ---
  const responseData = {
    learners: learnersList,
    parentProfile: parentProfileObj,
    progressReports: progressReportsList,
    paymentHistory: paymentHistoryList,
    chatHistory: chatHistoryList,
    themes: themesList,
    events: eventsList,
    journalPosts: journalPostsList,
    enrolments: enrolmentsList,
    registers: registersList,
    parentProfiles: finalParentList,
    usingNeon: isNeonActive(),
  };

  sendWithEtag(responseData);
}

/**
 * Individual entity GET endpoints for granular frontend queries.
 * These return all records for the entity (no role-based filtering).
 * The frontend hooks handle role-based filtering client-side.
 */

export async function getLearners(_req: Request, res: Response): Promise<void> {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.learners}`);
      return rows.map((r: any) => rowToEntity(r, MAPPINGS.learners));
    },
    (store) => store.learners
  );
  res.json(result);
}

export async function getPayments(_req: Request, res: Response): Promise<void> {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.payments}`);
      return rows.map((r: any) => rowToEntity(r, MAPPINGS.payments));
    },
    (store) => store.paymentHistory
  );
  res.json(result);
}

export async function getThemes(_req: Request, res: Response): Promise<void> {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.themes}`);
      return rows.map((r: any) => rowToEntity(r, MAPPINGS.themes)).sort((a: any, b: any) => a.weekNo - b.weekNo);
    },
    (store) => store.themes
  );
  res.json(result);
}

export async function getEvents(_req: Request, res: Response): Promise<void> {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.events}`);
      return rows.map((r: any) => rowToEntity(r, MAPPINGS.events));
    },
    (store) => store.events
  );
  res.json(result);
}

export async function getJournalPosts(_req: Request, res: Response): Promise<void> {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.journal}`);
      return rows.map((r: any) => rowToEntity(r, MAPPINGS.journal));
    },
    (store) => store.journalPosts
  );
  res.json(result);
}
