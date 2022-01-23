import jwt from "jsonwebtoken";

interface TokenGenerateProps {
    id: string;
    email: string;
    password: string;
};

function tokenGenerate(params: TokenGenerateProps) {

  const secret = process.env.SECRET

  const token =  jwt.sign( 
    { id: params.id }, 
    secret,
    {
      expiresIn: "1d"
    }
  );
  return token;
};

export { tokenGenerate };