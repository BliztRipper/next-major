export default () => {
  return(
    <div style={{display:'flex',justifyContent:'center', alignItems:'center',flexDirection:'column',width:'100%',marginTop:'45%',textAlign:'center'}}>
      <img src="../Home/static/notsupport.svg"/>
      <h1 style={{color:'#333',fontSize:'1.2rem',fontWeight:'bold',}}>ไม่สามารถแสดงผลได้</h1>
      <p style={{color:'#666',marginTop:'0.4rem'}}>กรุณาอัปเดตระบบปฏิบัติการให้เป็นเวอร์ชันล่าสุด<br/>และทำรายการใหม่อีกครั้ง</p>
      <button style={{border: 'none', backgroundColor:'#ff8300',width:'100%',fontSize:'1rem', fontWeight:'bold',height:'4rem',color:'#fff',position:'fixed',bottom:0,left:0}}>ปิด</button>
    </div>
  )
}
