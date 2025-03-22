const { db } = require('../../firebaseconfig/firebase');
class MenuController {
  async index(req, res) {
      const menu=db.ref("monan");
      const snapshot= await menu.once("value");
      if(snapshot.exists()){
        res.json(snapshot.val());
      }else{
        res.status(404).json({message: "không có dữ liệu món ăn"})
      }  
  }
}

module.exports = new MenuController();
