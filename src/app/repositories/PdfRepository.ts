import { EntityRepository, Repository } from "typeorm";
import { Pdf } from "../models/Pdf";

@EntityRepository(Pdf) 
class PdfRepository extends Repository<Pdf> {}

export { PdfRepository };