import { Hono } from "hono";
import {
  addNote,
  getVideoNotes,
  editNote,
  removeNote,
  createNoteSchema,
  updateNoteSchema,
  videoIdParamSchema,
  noteIdParamSchema,
} from "../../controller/user/note.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateBody, validateParams } from "../../util/validate";

const note = new Hono();

note.post("/notes", authMiddleware, validateBody(createNoteSchema), addNote);
note.get("/notes/:videoId", authMiddleware, validateParams(videoIdParamSchema), getVideoNotes);
note.put(
  "/notes/:noteId",
  authMiddleware,
  validateParams(noteIdParamSchema),
  validateBody(updateNoteSchema),
  editNote
);
note.delete(
  "/notes/:noteId",
  authMiddleware,
  validateParams(noteIdParamSchema),
  removeNote
);

export default note;
