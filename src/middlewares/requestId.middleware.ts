import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

export const REQUEST_ID_HEADER = "X-Request-ID";

const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const incomingRequestId = req.get(REQUEST_ID_HEADER);

  const id =
    incomingRequestId && incomingRequestId.trim().length > 0
      ? incomingRequestId.trim()
      : randomUUID();

  res.setHeader(REQUEST_ID_HEADER, id);

  res.locals.requestId = id;

  next();
};

export default requestId;
