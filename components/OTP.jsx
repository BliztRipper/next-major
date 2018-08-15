import { PureComponent } from 'react'
import GlobalHeader from '../components/GlobalHeader'

class OTP extends PureComponent {
  constructor(props) {
    super(props);
      this.state = {
        userNumber: '099-999-9999',
        otpNumberValue: '',
        otpMatchCode: 'HUTV',
        optSubmited: false
      }
  }
  handleBackButton () {
    
  }
  handleOtpInput (e) {
    let inputValue = e.target.value
    let maxValue = e.target.maxLength
    this.setState({otpNumberValue: inputValue.substring(0, maxValue)})
    if (inputValue.length >= maxValue && !this.state.optSubmited) {
      this.state.optSubmited = true
      console.log('OTP : handleOtpInput')
    }
  }
  handleOtpResend () {
    console.log('OTP : handleOtpResend')
  }  
  render () {
    const { userNumber, otpNumberValue, otpMatchCode } = this.state
    return (
      <div className="otp">
        <GlobalHeader handleBackButton={this.handleBackButton} titleMsg="กรอกรหัสยืนยัน" hideBtnBack={true}></GlobalHeader>
        <div className="otp__inner">
          <div className="otp__info">
            <div className="otp__info-msg">รหัสยืนยันจะถูกส่งไปที่เบอร์</div>
            <div className="otp__info-telNumber">{userNumber}</div>
          </div>
          <div className="otp__input"><div><input type="number" maxLength="6" value={otpNumberValue} onInput={this.handleOtpInput.bind(this)}/></div></div>
          <div className="otp__help">Ref รหัสยืนยัน : {otpMatchCode}</div>
          <div className="otp__resend"><div onClick={this.handleOtpResend.bind(this)}>ขอรหัสยืนยันอีกครั้ง</div></div>
        </div>
      </div>
    )
  }
}

export default OTP;