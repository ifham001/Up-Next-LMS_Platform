import { and, eq, asc } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { note } from "../../schema/user/note";

export const createNote = async (
  userId: string,
  videoId: string,
  timestampSeconds: number,
  content: string
) => {
  const [created] = await dbDrizzle
    .insert(note)
    .values({ userId, videoId, timestampSeconds, content })
    .returning();
  return created;
};

// The caller's notes for a video, ordered by position in the video.
export const listNotesByVideo = async (userId: string, videoId: string) => {
  return dbDrizzle
    .select()
    .from(note)
    .where(and(eq(note.userId, userId), eq(note.videoId, videoId)))
    .orderBy(asc(note.timestampSeconds));
};

// Update a note, scoped to its owner. Returns undefined if not found/owned.
export const updateNote = async (
  userId: string,
  noteId: string,
  fields: { content?: string; timestampSeconds?: number }
) => {
  const [updated] = await dbDrizzle
    .update(note)
    .set({ ...fields, updatedAt: new Date() })
    .where(and(eq(note.id, noteId), eq(note.userId, userId)))
    .returning();
  return updated;
};

// Delete a note, scoped to its owner.
export const deleteNote = async (userId: string, noteId: string) => {
  const deleted = await dbDrizzle
    .delete(note)
    .where(and(eq(note.id, noteId), eq(note.userId, userId)))
    .returning();
  return deleted.length > 0;
};
