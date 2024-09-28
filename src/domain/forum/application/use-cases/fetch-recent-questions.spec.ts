import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'
import { MakeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import type { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      MakeQuestion({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      MakeQuestion({ createdAt: new Date(2024, 0, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      MakeQuestion({ createdAt: new Date(2024, 0, 23) }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.value?.questions).toHaveLength(3)
    expect(result.value?.questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2024, 0, 23),
      }),
      expect.objectContaining({
        createdAt: new Date(2024, 0, 20),
      }),
      expect.objectContaining({
        createdAt: new Date(2024, 0, 18),
      }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsRepository.create(MakeQuestion())
    }

    const restul = await sut.execute({ page: 2 })

    expect(restul.value?.questions).toHaveLength(2)
  })
})
