import { PureComponent } from 'react'
import GlobalHeader from '../components/GlobalHeader'

class OTP extends PureComponent {
  constructor(props) {
    super(props);
      this.state = {
        userNumber: this.props.userAuthData.mobileno,
        otpNumberValue: '',
        otpMatchCode: this.props.userAuthData.otp_ref,
        optSubmited: false,
        otpResendMsg: 'ขอรหัสยืนยันอีกครั้ง',
        otpResending: false
      }
  }
  handleOtpInput (e) {
    let inputValue = e.target.value
    let maxValue = e.target.maxLength
    inputValue = inputValue.substring(0, maxValue)
    this.setState({otpNumberValue: inputValue})
    if (inputValue.length >= maxValue && !this.state.optSubmited) {
      this.state.optSubmited = true
      this.props.authOtpVerify(inputValue)
    }
  }
  handleOtpResend () {
    this.props.authOtpGetOtp()
  }
  render () {
    const { userNumber, otpNumberValue, otpMatchCode, otpResendMsg, otpResending } = this.state
    let parentClassName = 'otp'
    if (otpResending) parentClassName = parentClassName + ' sending'
    return (
      <div className={parentClassName}>
        <GlobalHeader titleMsg="กรอกรหัสยืนยัน" hideBtnBack={true}></GlobalHeader>
        <div className="otp__inner">
          <div className="otp__info">
            <div className="otp__info-msg">รหัสยืนยันจะถูกส่ง SMS ไปที่เบอร์</div>
            <div className="otp__info-telNumber">{userNumber}</div>
          </div>
          <div className="otp__input"><div><input type="tel" maxLength="6" value={otpNumberValue} onInput={this.handleOtpInput.bind(this)}/></div></div>
          <div className="otp__help">Ref รหัสยืนยัน : {otpMatchCode}</div>
          <div className="otp__resend"><div onClick={this.handleOtpResend.bind(this)}> {otpResendMsg} </div></div>
        </div>
      </div>
    )
  }
}

export default OTP;