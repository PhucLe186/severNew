const { db } = require('../../firebaseconfig/firebase');
class CartController {
  async index(req, res) {
      try {
        if(!req.session.user){
            res.status(404).json({message: "bạn chưa đăng nhập"})
            return;
        }
        const userId = req.session.user.uid;
      const menu=db.ref(`GioHang/${userId}`);
      const snapshot= await menu.once("value");
      if(snapshot.exists()){
        res.json(snapshot.val());
      }else{
        res.status(404).json({message: "không có dữ liệu món ăn"})
      }  } catch (error) {
        console.error(error); // In lỗi ra console để debug
        res.status(500).json({ message: "Lỗi server" });
      }
  };



  async deploy(req, res) {
    try {
       

        const userId = req.session.user.uid;
        const { ID_MonAn } = req.body.ID_MonAn;

        if (!userId || !ID_MonAn) {
            console.log("Dữ liệu không hợp lệ", { userId, ID_MonAn });
            return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }

        console.log("UserID:", userId);
        console.log("ID_MonAn:", ID_MonAn);

        const cartRef = db.ref(`GioHang/${userId}/${ID_MonAn}`);
        const cartSnapshot = await cartRef.once("value");

        if (!cartSnapshot.exists()) {
            console.log("Món hàng không tồn tại trong giỏ hàng");
            return res.status(404).json({ message: "Món hàng không tồn tại trong giỏ hàng" });
        }

        console.log("Cart Snapshot exists, proceeding to remove");

        await cartRef.remove(); // Sử dụng remove() của reference
        console.log("Item removed successfully");

        const updatedCart = (await db.ref(`GioHang/${userId}`).once("value")).val();

        console.log("Updated Cart:", updatedCart);

        return res.json(updatedCart);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
}
}

module.exports = new CartController();
