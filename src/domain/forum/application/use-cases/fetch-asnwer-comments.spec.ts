import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { MakeAnswerComment } from 'test/factories/make-answer-comment'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      MakeAnswerComment({
        answerId: new UniqueEntityID('answer_1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      MakeAnswerComment({
        answerId: new UniqueEntityID('answer_1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      MakeAnswerComment({
        answerId: new UniqueEntityID('answer_1'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer_1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        MakeAnswerComment({
          answerId: new UniqueEntityID('answer_1'),
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer_1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
