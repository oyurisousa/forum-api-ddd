import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { MakeQuestionComment } from 'test/factories/make-question-comment'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID('question_1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID('question_1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({
        questionId: new UniqueEntityID('question_1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question_1',
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        MakeQuestionComment({
          questionId: new UniqueEntityID('question_1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question_1',
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
