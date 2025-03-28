const { db } = require('../../firebaseconfig/firebase');
class CartController {
  async index(req, res) {
      try {  
      const userId = req.session.user.uid;
      const menu=db.ref(`GioHang`);
      const snapshot= await menu.once("value");
      if(snapshot.exists()){
        res.json(snapshot.val());
      }else{
        res.status(404).json({message: "không có dữ liệu món ăn"})
      }  }
       catch (error) {
        res.status(500).json({ message: "Lỗi server" });
      }
  };
}

module.exports = new CartController();
