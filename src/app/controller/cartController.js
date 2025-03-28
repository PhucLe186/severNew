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
      if (!req.session.user) {
          return res.status(401).json({ message: "Bạn chưa đăng nhập" });
      }

      const userId = req.session.user.uid;  
      const { ID_MonAn, SoLuong } = req.body;

      if (!ID_MonAn) {
          return res.status(400).json({ message: "Thiếu ID món ăn" });
      }

      console.log("User ID:", userId);
      console.log("ID Món Ăn:", ID_MonAn);

      const cartRef = db.ref(`GioHang/${userId}/${ID_MonAn}`);
      const food = db.ref(`monan/${ID_MonAn}`);
      const snapshot=await food.once("value")

      const item =snapshot.val()

      const cartSnapshot = await cartRef.once("value");

      if (!cartSnapshot.exists()) {
          return res.status(404).json({ message: "Món ăn không tồn tại trong giỏ hàng" });
      }

      await cartRef.remove();
      await food.update({SoLuong: item.SoLuong+=SoLuong})
      if(item.SoLuong>1){
        await food.update({TrangThai: "còn"})
      }
      return res.json({message : "Món ăn không tồn tại trong giỏ hàng"});

      
  } catch (error) {
     
      return res.status(500).json({ success: false, message: "Lỗi server", error: error.toString() });
  }
};
async updateQuantity(req,res){
      try{
        const{ action, ID_MonAn}=req.body
        const UserID=req.session.user.uid
       //////////////////////////////////////////////////////////////////
        const ref = db.ref(`GioHang/${UserID}/${ID_MonAn}`)
        const snapshot=await ref.once("value")
        console.log("tới đây rồi 2")
        const data=snapshot.val()
        let soLuong=data.soLuong
//////////////////////////////////////////////////////
        const menu= db.ref(`monan/${ID_MonAn}`)
        const item = await menu.once("value")
        const update =item.val()
        let food=update.SoLuong
        
        if(action==="increase"){
          if(food<0){
            res.status(400).json({message: 'món này đã hết'})
            return;
          }else{
            soLuong+=1;
            food-=1;
          }
        }else{
          Math.max(soLuong-=1,0);
          food+=1
        }



        // action==="increase"? soLuong+=1 && food-=1 : Math.max(soLuong-1,0)&&food+1
        // console.log("tới đây rồi 3")
        if(soLuong===0){
          await ref.remove();
        }else{
          await ref.update({soLuong})
          
        }

        await menu.update({SoLuong:food})
        
       



        console.log("tới đây rồi 4")
        res.json({success:true, soLuong, food})
      }catch(error){
        console.log(error)
        res.status(400).json({message: 'lỗi kỹ thuật'})
      }


}

}

module.exports = new CartController();
