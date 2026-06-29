import { Context } from "hono";
import { z } from "zod";
import {
  createNote,
  listNotesByVideo,
  updateNote,
  deleteNote,
} from "../../queries/user/note.queries";
import { getValidated } from "../../util/validate";
import { ok, created } from "../../util/response";
import { NotFoundError, UnauthorizedError } from "../../util/errors";

export const createNoteSchema = z.object({
  videoId: z.string().uuid(),
  timestampSeconds: z.number().int().min(0).default(0),
  content: z.string().min(1).max(2000),
});

export const updateNoteSchema = z
  .object({
    content: z.string().min(1).max(2000).optional(),
    timestampSeconds: z.number().int().min(0).optional(),
  })
  .refine((v) => v.content !== undefined || v.timestampSeconds !== undefined, {
    message: "Provide content or timestampSeconds to update",
  });

export const videoIdParamSchema = z.object({ videoId: z.string().uuid() });
export const noteIdParamSchema = z.object({ noteId: z.string().uuid() });

const currentUserId = (c: Context): string => {
  const payload = c.get("user") as { id?: string } | undefined;
  if (!payload?.id) throw new UnauthorizedError("Authentication required");
  return payload.id;
};

// POST /user/notes
export const addNote = async (c: Context) => {
  const userId = currentUserId(c);
  const { videoId, timestampSeconds, content } =
    getValidated<z.infer<typeof createNoteSchema>>(c, "body");
  const note = await createNote(userId, videoId, timestampSeconds, content);
  return created(c, { note }, "Note created");
};

// GET /user/notes/:videoId
export const getVideoNotes = async (c: Context) => {
  const userId = currentUserId(c);
  const { videoId } = getValidated<z.infer<typeof videoIdParamSchema>>(c, "params");
  const notes = await listNotesByVideo(userId, videoId);
  return ok(c, { notes }, "Notes fetched");
};

// PUT /user/notes/:noteId
export const editNote = async (c: Context) => {
  const userId = currentUserId(c);
  const { noteId } = getValidated<z.infer<typeof noteIdParamSchema>>(c, "params");
  const fields = getValidated<z.infer<typeof updateNoteSchema>>(c, "body");
  const note = await updateNote(userId, noteId, fields);
  if (!note) throw new NotFoundError("Note not found");
  return ok(c, { note }, "Note updated");
};

// DELETE /user/notes/:noteId
export const removeNote = async (c: Context) => {
  const userId = currentUserId(c);
  const { noteId } = getValidated<z.infer<typeof noteIdParamSchema>>(c, "params");
  const removed = await deleteNote(userId, noteId);
  if (!removed) throw new NotFoundError("Note not found");
  return ok(c, undefined, "Note deleted");
};
