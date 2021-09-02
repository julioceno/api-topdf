import jwt from "jsonwebtoken";

interface TokenGenerateProps {
    id: string;
    email: string;
    password: string;
};

function tokenGenerate(params: TokenGenerateProps) {
  const token =  jwt.sign(params.id, process.env.SECRET || "")

  return token;
};

export { tokenGenerate };