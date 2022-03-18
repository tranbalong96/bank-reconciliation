import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { TransactionRepository } from "./transaction.repository";
import { TransactionModule } from "./transaction.module";
import { getRepositoryToken } from '@nestjs/typeorm';
import { TYPE } from './constant/type.constant';



describe('TransactionRepository', () => {
    let repo: TransactionRepository;
    // let connection: Connection;
    const mockTransactionRepository = {
        getAllTransaction: jest.fn(() => ([
            {
                id: 1,
                content: 'xyz',
                amount: 1000,
                type: TYPE.DEPOSIT,
                date: new Date('2022-03-17T16:16:40.592Z')
            },
            {
                id: 2,
                content: 'ABC',
                amount: 2000,
                type: TYPE.DEPOSIT,
                date: new Date('2022-03-17T16:11:40.592Z')
            },
            {
                id: 3,
                content: 'VBB',
                amount: -2000,
                type: TYPE.WITHDRAW,
                date: new Date('2022-03-17T16:21:40.592Z')
            }
        ])),
        getById: jest.fn((id) => (
            {
                id,
                content: 'xyz',
                amount: 1000,
                type: TYPE.DEPOSIT,
                date: new Date('2022-03-17T16:16:40.592Z')
            }
        )),
        saveTransaction: jest.fn(dto => ({
            id: Date.now(),
            ...dto
        })),
        updateTransaction: jest.fn().mockImplementation((id, dto) => ({
            id,
            ...dto
        })),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TransactionRepository,
                {
                    provide: getRepositoryToken(TransactionRepository),
                    useValue: mockTransactionRepository
                }
            ],
        }).compile();

        repo = module.get<TransactionRepository>(TransactionRepository);
        // connection = module.get<Connection>(Connection);
    });

    afterEach(async () => {
        // await connection.close();
    });

    it('should be defined', () => {
        expect(repo).toBeDefined();
        // expect(connection).toBeDefined();
    });

    it('should get all transaction', () => {
        expect(repo.getAllTransaction()).toEqual([{
            id: 1,
            content: 'xyz',
            amount: 1000,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T16:16:40.592Z')
        },
        {
            id: 2,
            content: 'ABC',
            amount: 2000,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T16:11:40.592Z')
        },
        {
            id: 3,
            content: 'VBB',
            amount: -2000,
            type: TYPE.WITHDRAW,
            date: new Date('2022-03-17T16:21:40.592Z')
        }]);
        expect(mockTransactionRepository.getAllTransaction).toHaveBeenCalled();
    });

    it('should get by id', () => {
        expect(repo.getById(1)).toEqual({
            id: 1,
            content: 'xyz',
            amount: 1000,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T16:16:40.592Z')
        });
        expect(mockTransactionRepository.getById).toHaveBeenCalledWith(1);
    });

    it('should create new transaction', () => {
        const dto = {
            content: 'ABC',
            amount: 100,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T15:16:40.592Z')
        };
        expect(repo.saveTransaction(dto)).toEqual({
            id: expect.any(Number),
            content: 'ABC',
            amount: 100,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T15:16:40.592Z')
        });
        expect(mockTransactionRepository.saveTransaction).toHaveBeenCalledWith(dto);
    });

    it('should update transaction', () => {
        const dto = {
            content: 'xyz',
            amount: 1000,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T16:16:40.592Z')
        };

        expect(repo.updateTransaction(1, dto)).toEqual({
            id: 1,
            ...dto
        });
        expect(mockTransactionRepository.updateTransaction).toHaveBeenCalledWith(1, dto);
    });
});