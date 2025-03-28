const { db } = require('../../firebaseconfig/firebase');
class VoucherController {
  async voucher(req, res) {
    const UserID= req.session.user.uid
    if(!UserID)
    {
        return res.status(400).json({ message: 'mày chưa đăng nhập kìa ku' });
    }
    
    const table=db.ref("voucher");
    const snapshot= await table.once("value");
    if(!snapshot.exists()){
        res.status(400).json({ message: 'k có dữ liệu bàn' });
    }
      res.json(snapshot.val());
}


// Trong controller khi người dùng chọn voucher
async selectVoucher(req, res) {
       
        const { vouchercode } = req.body;
        const UserID = req.session.user.uid;
        if(!UserID) {
            return res.status(400).json({ message: 'mày chưa đăng nhập kìa ku' });
        }

        const voucherSnapshot = await db.ref(`voucher/${vouchercode}`).once("value");
        const voucher = voucherSnapshot.val();

        if (!voucher) {
            return res.status(404).json({ message: "Voucher không tồn tại" });
        }

        req.session.user.selected = vouchercode;
        console.log(req.session.user)
        res.json({ success: true, message: 'Voucher đã được chọn' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi chọn voucher' });
    }
    



async apply(req, res){
   try{
    const UserID=req.session.user.uid
    if(!UserID){
        return res.status(400).json({ message: 'mày chưa đăng nhập kìa ku' });
    }
    const vouchercode= req.session.user.selected
        const snapshot=  await db.ref(`voucher/${vouchercode}`).once("value")
        const code=snapshot.val()
        if (!code) {
            return res.status(404).json({ message: "Voucher không tồn tại" });
        }
        const today = new Date();
        const expiryDate = new Date(code.NgayHetHan);
        if (today > expiryDate) {
            return res.status(400).json({ message: "Voucher đã hết hạn" });
        }
        const Cart= db.ref(`GioHang/${UserID}`);
        const Cartsnapshot= await Cart.once("value")
        const Data= Cartsnapshot.val();
        if(!Data){
            return res.status(404).json({ message: "chưa có món ăn trong giỏ hàng" });
        }
        let total=0
        for(const Id in Data){
            const mon=Data[Id]
            total+=mon.ThanhTien*mon.soLuong
        }
        let discountPercent=code.GiaTriVoucher
        let lastmoney=0

        if(discountPercent<=100){
             lastmoney = total-(total*discountPercent)/100;
        }else{
            lastmoney=total-discountPercent
        }
        delete req.session.user.selected;
        console.log(req.session.user)
        return res.json({success:true, lastmoney: lastmoney})
    }catch(error){
        return res.status(404).json({ message: "lỗi đầy mình" });
        }      
} 
        

}


module.exports = new VoucherController();


