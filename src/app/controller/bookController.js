const { db } = require('../../firebaseconfig/firebase');
class BookController {
  async table(req, res) {
      const table=db.ref("ban");
      const snapshot= await table.once("value");
      if(!snapshot.exists()){
        res.status(400)
          .json({ message: 'k có dữ liệu bàn' });
      }
      res.json(snapshot.val());
};

async book(req, res){
    try{
    const UserID=req.session.user.uid;
    const {TenKhachHang, ID_Ban, SoDienThoai, SoLuong, ThoiGian,note, ThanhTien }=req.body
    if(!UserID){
     return res.status(400).json({ message: 'bạn chưa đăng nhập' });
    } 
    if (!TenKhachHang || !ID_Ban || !SoDienThoai || !SoLuong || !ThoiGian) {
      return res.status(400).json({ message: "Thiếu dữ liệu đặt bàn" });
    }
    const datatable= (await db.ref('ban').child(ID_Ban).once("value")).val();
    const TenBan=datatable.TenBan
///////////////////////////////////////////////////////////////////////////////////////////
    const Cart= db.ref(`GioHang/${UserID}`);
    const snapshot= await Cart.once("value")
    
 
    if(!snapshot.exists()){
      return res.status(400).json({ message: 'giỏ hàng trống' });
    }
    const Datacart= (snapshot.val());

   
    let tongtien=0
    for(const id in Datacart){
      const mon=Datacart[id]
      tongtien+=mon.ThanhTien*mon.soLuong
      
    }  
      const ID_ChiTietBan= db.ref(`chitietban`).push().key; 
      const datban=db.ref(`chitietban/${ID_ChiTietBan}`);
      
      await datban.set({
        UserID,
        TenKhachHang,
        TenBan, 
        SoDienThoai, 
        SoLuong, 
        ThoiGian,
        note, 
        MonAn: Datacart,
        trangthai: 1,
        ThanhTien
      })
      await db.ref(`ban/${ID_Ban}`).update({TinhTrangBan:"1"})
      await Cart.remove();
      return res.status(200).json({success: true, message: "đặt bàn thành công"})
    }
    catch(error){
     
      res.status(500).json({ error: "lỗi đầy mình"})
    }
}



}


module.exports = new BookController();
