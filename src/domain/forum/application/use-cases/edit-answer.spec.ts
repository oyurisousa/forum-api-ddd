import { EditAnswerUseCase } from './edit-answer'
import { MakeAnswer } from 'test/factories/make-asnwer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { MakeAnswerAttachment } from 'test/factories/make-answer-attachments'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswersAttachmentsRepository,
    )
  })

  it('should be able to edit a  answer', async () => {
    const newAnswer = MakeAnswer(
      { authorId: new UniqueEntityID('author_1'), content: 'my content1' },
      new UniqueEntityID('answer_1'),
    )
    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswersAttachmentsRepository.items.push(
      MakeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      MakeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author_1',
      content: 'my content2',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'my content2',
    })
    expect(inMemoryAnswersAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({
          props: expect.objectContaining({
            attachmentId: new UniqueEntityID('1'),
          }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({
            attachmentId: new UniqueEntityID('3'),
          }),
        }),
      ],
    )
  })

  it('should not be able to edit a answer of other author', async () => {
    const newAnswer = MakeAnswer(
      { authorId: new UniqueEntityID('author_1') },
      new UniqueEntityID('answer_1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author_x',
      content: 'my content2',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
