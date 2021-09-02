import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers
  
  if (!authorization) {
    return res.status(401).json({error: "No token provider"});
  };

  const parts = authorization.split(" ");

  if (parts.length !== 2 ) {
    return res.status(401).send({ error: "Token Error"});
  };

  const [ scheme, token ] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token malformatted" });
  };

  try {
    const id = jwt.verify(token, process.env.SECRET || "");
    req.userId = String(id);

    return next()
  } catch {
    return res.status(401).json({ error: "Token error" });
  };
}

export { authMiddleware };