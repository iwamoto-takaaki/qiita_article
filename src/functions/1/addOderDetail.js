// ユーザのカートに商品を追加して、合計の注文数を返す関数
function addOderDetail(userId, productId, amount) {
    // userIdの型チェック
    if (userId == "") {
        throw new Exception("userIdが空です");
    }

    // userの存在チェック
    if (findUser(userId) == null) {
        throw new Exception("userIdが存在しませんでした")
    } 

    // productIdの型チェック
    if (productId == "") {
        throw new Exception("productIdが空です")
    }

    // amountの型チェック
    if (amount < 1 || amount % 1 !== 0) {
        throw new Exception("注文数が正の整数ではありません")
    }

    // 既存の注文をチェック
    const orderDetail = getOrderDetail(userId, productId);
    if (orderDetail === null) {
        // 新規の注文だったとき
        const newOrderDetail = new {
            id: 0,
            userId: userId,
            productId: productID,
            amount: amount
        };
        const savedOderDetail = InsertOderDetail(newOrderDetail);  
        // savedOderDetailをそのまま帰すのは問題があるものとする
        return {
            id: savedOderDetail.id, 
            amount: savedOderDetail.amount
        }     
    } else {
        // 既存の注文があったとき、数量を追加する
        orderDetail.amount += amount;
        const updatedOserDetail = updateOserDetail(oderDetail);
        // savedOderDetailをそのまま帰すのは問題があるものとする
        return {
            id: updatedOserDetail.id,
            amount: updatedOderDetail.amount
        }
    }
}
