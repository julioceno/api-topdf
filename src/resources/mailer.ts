import path from "path";
import nodemailer from "nodemailer"; 
import hbs from "nodemailer-express-handlebars";

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "44d60d02c27160",
    pass: "8cf09ba841658d"
  }
});

transport.use("compile", hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve(".src/views/emails/"),
  },
  viewPath: path.resolve("./src/views/emails/"),
  extName: ".hbs",
})) 

export { transport };