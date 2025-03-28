const { db } = require('../../firebaseconfig/firebase');//UserID
class DetailController {
    async index(req, res){ 
        const UserID=req.session.user.uid
        if(UserID){
            try{
                const check= await db.ref('chitietban').orderByChild('UserID').equalTo(UserID).once('value')
                if(!check.exists()){
                    res.status(400).json({error:"lỗi thực thi"})
                }
                const detal=db.ref(`chitietban`)
            const snapshot= await detal.once("value")
            const data= snapshot.val()

            ///////////////////////////////////////////
            // const food= db.ref(`chitietban/${key}/MonAn`)
            // const foodref= await food.once("value")
            // const datafood= foodref.val()
            // const namefood=Object.values(datafood).map(item=>item.TenMonAn)
            
            res.json({ success:true  , data: data})


            }catch(error){
            res.status(400).json({error:"lỗi hiển thị"})
        }
        }
       
    }



}
module.exports = new DetailController();