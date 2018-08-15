import { PureComponent } from 'react'
import GlobalHeader from '../components/GlobalHeader'

class OTP extends PureComponent {
  constructor(props) {
    super(props);
      this.state = {
        userNumber: '099-999-9999',
        otpNumberValue: '',
        otpMatchCode: this.props.userAuthData.otp_ref,
        optSubmited: false
      }
  }
  handleBackButton () {
    
  }
  handleOtpInput (e) {
    let inputValue = e.target.value
    let maxValue = e.target.maxLength
    this.state.otpNumberValue = inputValue.substring(0, maxValue)
    this.setState({otpNumberValue: this.state.otpNumberValue})
    if (inputValue.length >= maxValue && !this.state.optSubmited) {
      this.state.optSubmited = true
      this.authOtpVerify(this.state.otpNumberValue)
    }
  }
  handleOtpResend () {
    this.authOtpVerify(this.state.otpNumberValue)
  }
  authOtpVerify (otpCode) {
    let userAuthData = this.props.userAuthData
    let dataToStorage = {
      otp_ref: userAuthData.otp_ref,
      otp_code: otpCode,
      agreement_id: userAuthData.agreement_id,
      auth_code: userAuthData.auth_code,
      tmn_account : userAuthData.phoneNumber
    }
    console.log(dataToStorage, 'dataToStorage verify')
    try {
      fetch(`https://api-cinema.truemoney.net/AuthVerify/${userAuthData.phoneNumber}`,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': '085c43145ffc4727a483bc78a7dc4aae',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToStorage)
      })
      .then(response => response.json())
      .then((data) =>  {
        console.log(data, 'get verify')
      })
    } catch (error) {
      console.error('error', error);
    }
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