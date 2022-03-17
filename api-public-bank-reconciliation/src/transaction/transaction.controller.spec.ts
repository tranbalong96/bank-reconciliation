import { Test, TestingModule } from '@nestjs/testing';
import { TYPE } from './constant/type.constant';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
    let controller: TransactionController;
    const mockTransactionService = {
        create: jest.fn(dto => ({
            id: Date.now(),
            ...dto
        })),
        update: jest.fn().mockImplementation((id, dto) => ({
            id,
            ...dto
        })),
        getAll: jest.fn(() => ([{
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
        }])),
        getById: jest.fn((id) => ({
            id,
            content: 'XYZ',
            amount: 1000,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T16:16:40.592Z')
        }))
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [TransactionService],
        })
            .overrideProvider(TransactionService)
            .useValue(mockTransactionService)
            .compile();

        controller = module.get<TransactionController>(TransactionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create new transaction', () => {
        const dto = {
            content: 'ABC',
            amount: 100,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T15:16:40.592Z')
        };
        expect(controller.create(dto)).toEqual({
            id: expect.any(Number),
            content: 'ABC',
            amount: 100,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T15:16:40.592Z')
        });
        expect(mockTransactionService.create).toHaveBeenCalledWith(dto);
    });

    it('should update transaction', () => {
        const dto = {
            content: 'xyz',
            amount: 1000,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T16:16:40.592Z')
        };

        expect(controller.update(1, dto)).toEqual({
            id: 1,
            ...dto
        });
        expect(mockTransactionService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should get all transaction', () => {
        expect(controller.getAll()).toEqual([
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
        ]);

        expect(mockTransactionService.getAll).toHaveBeenCalled();
    });
    
    it('should get one transaction by id', () => {
        expect(controller.getById(1)).toEqual({
            id: 1,
            content: 'XYZ',
            amount: 1000,
            type: TYPE.DEPOSIT,
            date: new Date('2022-03-17T16:16:40.592Z')
        });
        expect(mockTransactionService.getById).toHaveBeenCalledWith(1);
    });


});
