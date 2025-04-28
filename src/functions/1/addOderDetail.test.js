const { addOderDetail } = require('./addOderDetail');

// Mock dependencies
jest.mock('./dependencies', () => ({
    findUser: jest.fn(),
    getOrderDetail: jest.fn(),
    InsertOderDetail: jest.fn(),
    updateOserDetail: jest.fn()
}));

const { findUser, getOrderDetail, InsertOderDetail, updateOserDetail } = require('./dependencies');

describe('addOderDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('userIdが空の場合、例外をスローする', () => {
        expect(() => addOderDetail('', 'product1', 1)).toThrow('userIdが空です');
    });

    it('userIdが存在しない場合、例外をスローする', () => {
        findUser.mockReturnValue(null);
        expect(() => addOderDetail('user1', 'product1', 1)).toThrow('userIdが存在しませんでした');
    });

    it('productIdが空の場合、例外をスローする', () => {
        expect(() => addOderDetail('user1', '', 1)).toThrow('productIdが空です');
    });

    it('注文数が正の整数でない場合、例外をスローする', () => {
        expect(() => addOderDetail('user1', 'product1', 0)).toThrow('注文数が正の整数ではありません');
        expect(() => addOderDetail('user1', 'product1', 1.5)).toThrow('注文数が正の整数ではありません');
    });

    it('既存の注文が見つからない場合、新しい注文を作成する', () => {
        findUser.mockReturnValue({ id: 'user1' });
        getOrderDetail.mockReturnValue(null);
        InsertOderDetail.mockReturnValue({ id: 1, amount: 2 });

        const result = addOderDetail('user1', 'product1', 2);

        expect(result).toEqual({ id: 1, amount: 2 });
        expect(InsertOderDetail).toHaveBeenCalledWith({
            id: 0,
            userId: 'user1',
            productId: 'product1',
            amount: 2
        });
    });

    it('既存の注文が見つかった場合、注文数を更新する', () => {
        findUser.mockReturnValue({ id: 'user1' });
        getOrderDetail.mockReturnValue({ id: 1, amount: 2 });
        updateOserDetail.mockReturnValue({ id: 1, amount: 4 });

        const result = addOderDetail('user1', 'product1', 2);

        expect(result).toEqual({ id: 1, amount: 4 });
        expect(updateOserDetail).toHaveBeenCalledWith({ id: 1, amount: 4 });
    });
});