import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  findById(answerId: string): Promise<Answer | null>
  findManyByQuestionId(
    QuestionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
  save(answer: Answer): Promise<void>
  create(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
}
