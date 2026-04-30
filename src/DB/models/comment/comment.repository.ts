import { IComment } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { comment } from "./comment.model";

export class CommentRepository extends AbstractRepository<IComment> {
  constructor() {
    super(comment);
  }
}

export const commentRepo = new CommentRepository();
