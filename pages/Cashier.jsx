import { PureComponent } from "react";
import "../styles/style.scss";
import Layout from "../components/Layout";
import Ticket from "../components/Ticket";
import Swal from "sweetalert2";
import Router from "next/router";
import utilities from "../scripts/utilities";
import GlobalHeader from "../components/GlobalHeader";
import { URL_PROD,API_KEY, URL_PAYMENT_PROD } from '../lib/URL_ENV';

class Cashier extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      dataToPayment: {
        tmn_id: "",
        mobile_no: "",
        third_party_tx_id: "",
        amount_satang: 0,
        currency: "THB",
        return_url: `${URL_PROD}/CompleteOrder`,
        payload: {}
      },
      dataToTicket: "",
      apiOtpHeader: {
        "X-API-Key": `${API_KEY}`
      },
      BookingMovie: "",
      BookingDuration: "",
      BookingGenre: "",
      BookingCinema: "",
      BookingBranchLocation: "",
      BookingMovieTH: "",
      BookingPoster: "",
      BookingScreenName: "",
      BookingSeat: "",
      BookingDate: "",
      BookingFullDate: "",
      BookingAttributesNames: "",
      BookingTime: "",
      BookingPrice: "",
      BookingPriceDisplay: "",
      BookingUserSessionId: "",
      BookingUserPhoneNumber: "",
      BookingCurrentServerTime: "",
      success: false,
      VistaBookingId: "",
      VistaBookingNumber: "",
      movieSelected: "",
      userInfo: "",
      queryTxTimer: "",
      queryTxCounter: 0
    };
    this.refTicket = React.createRef();
  }
  submitPayment() {
    if (this.refTicket.current.postingTicket) return false;
    this.refTicket.current.setState({ postingTicket: true });
    try {
      fetch(`${URL_PAYMENT_PROD}/Payment`, {
        method: "POST",
        headers: this.state.apiOtpHeader,
        body: JSON.stringify(this.state.dataToPayment)
      })
        .then(response => response.json())
        .then(data => {
          if (data.description === 'Pending') {
            this.paymentOnPending()
          } else if (data.status_code === 0 || data.description === "Success") {
            this.afterPaymentSuccess(data.data.data)
          } else if (data.description && data.description.slice(0, 7) === "PAY0011") {
            Swal({
              title: "ไม่สามารถซื้อตั๋วได้",
              imageUrl: "../Home/static/nobalance.svg",
              imageWidth: 200,
              imageHeight: 200,
              grow: "fullscreen",
              html: `ยอดเงินในบัญชีของคุณไม่เพียงพอ<br/>กรุณาเติมเงินเข้าวอลเล็ท และทำรายการใหม่อีกครั้ง`,
              onAfterClose: () => {
                Router.back();
              }
            });
          } else if (data.status_code === 35000) {
            Swal({
              title: "ขออภัยระบบขัดข้อง",
              imageUrl: "../Home/static/error.svg",
              imageWidth: 200,
              imageHeight: 200,
              html: `เกิดข้อผิดพลาด ไม่สามารถทำรายการได้ในขณะนี้<br/>กรุณาลองใหม่อีกครั้ง<br/>code:${data.description.slice(0,7)}`,
              onAfterClose: () => {
                Router.back();
              }
            });
          } else {
            Swal({
              title: "ไม่สามารถทำรายการได้",
              imageUrl: "../Home/static/error.svg",
              imageWidth: 200,
              imageHeight: 200,
              text: `กรุณาทำรายการใหม่อีกครั้ง หากพบปัญหาติดต่อทรูมันนี่ แคร์ 1240`,
              html: `${data.description} (code:${data.status_code})`,
              onAfterClose: () => {
                Router.back();
              }
            });
          }
        });
    } catch (error) {
      console.error("error", error);
    }
  }
  paymentOnPending () {
    this.queryTx()
  }
  queryTx () {
    let totalEachResponseInSec = 5
    let totalTimeoutInSec = 30
    let sendDate = (new Date()).getTime()
    if (this.state.queryTxTimer) {
      clearTimeout(this.state.queryTxTimer)
      this.state.queryTxTimer = ''
    }
    try {
      fetch(`${URL_PAYMENT_PROD}/QueryTx/${this.state.BookingUserSessionId}`)
      .then(response => response.json())
      .then(data => {
        if (this.state.queryTxCounter < (totalTimeoutInSec / totalEachResponseInSec)) {
          let instantPaymentStatusData = data.data
          let paymentStatus = instantPaymentStatusData.payment_status
          switch (paymentStatus) {
            case "Payment Pending":
              let responseDate = (new Date()).getTime()
              let totalResponseMs =  (totalEachResponseInSec * 1000) - (responseDate - sendDate)
              totalResponseMs = totalResponseMs > 0 ? totalResponseMs : 0
              this.state.queryTxTimer = setTimeout(() => {
                this.state.queryTxCounter += 1
                this.queryTx()
              }, totalResponseMs);
              break;
            case "Payment Success":
              this.afterPaymentSuccess(instantPaymentStatusData.noti_response.data)
              break;
            default:
              Swal({
                title: "ไม่สามารถทำรายการได้",
                imageUrl: "../static/error.svg",
                imageWidth: 200,
                imageHeight: 200,
                text: `กรุณาทำรายการใหม่อีกครั้ง หากพบปัญหาติดต่อทรูมันนี่ แคร์ 1240`,
                onAfterClose: () => {
                  Router.back();
                }
              });
              break;
          }
        } else {
          Swal({
            title: "ไม่สามารถทำรายการได้",
            imageUrl: "../static/error.svg",
            imageWidth: 200,
            imageHeight: 200,
            text: `กรุณาทำรายการใหม่อีกครั้ง หากพบปัญหาติดต่อทรูมันนี่ แคร์ 1240`,
            html: `${data.description} (code:${data.status_code})`,
            onAfterClose: () => {
              Router.back();
            }
          });
        }

      })
    } catch (error) {
      Swal({
        title: "ไม่สามารถทำรายการได้",
        imageUrl: "../static/error.svg",
        imageWidth: 200,
        imageHeight: 200,
        text: `กรุณาทำรายการใหม่อีกครั้ง หากพบปัญหาติดต่อทรูมันนี่ แคร์ 1240`,
        html: `${data.description} (code:${data.status_code})`,
        onAfterClose: () => {
          Router.back();
        }
      });
    }
  }
  afterPaymentSuccess (dataBooking) {
    sessionStorage.removeItem("movieSelect");
    let dataPaymentSuccess = {
      success: true,
      VistaBookingId: dataBooking.VistaBookingId,
      VistaBookingNumber: dataBooking.VistaBookingNumber
    };
    this.setState({ ...dataPaymentSuccess });
    this.refTicket.current.setState({
      postingTicket: false,
      ...dataPaymentSuccess
    });
    utilities.removeBookingInfoInSessionStorage();
    Router.beforePopState(({ url, as, options }) => {
      return false;
    });
    Swal({
      type: "success",
      title: "ทำรายการเสร็จสิ้น!",
      text: "ขอให้สนุกกับการชมภาพยนตร์",
      showConfirmButton: false,
      timer: 4000
    });
  }
  componentDidMount() {
    this.state.movieSelected = JSON.parse(
      sessionStorage.getItem("movieSelect")
    );
    try {
      let instantFullDate = new Date(sessionStorage.getItem("BookingDate"));
      let month = instantFullDate.getUTCMonth() + 1;
      let day = instantFullDate.getUTCDate();
      let year = instantFullDate.getUTCFullYear();
      let monthFormated = this.formatMonth(month);
      let bookingDate = day + " " + monthFormated;
      this.state.BookingFullDate = `${day}/${month}/${year}`;

      this.setState(
        {
          BookingMovie: String(this.state.movieSelected.title_en),
          BookingMovieTH: String(this.state.movieSelected.title_th),
          BookingDuration: String(this.state.movieSelected.duration),
          BookingGenre: String(this.state.movieSelected.genre),
          BookingPoster: String(this.state.movieSelected.poster_ori),
          BookingCinema: String(sessionStorage.getItem("BookingCinema")),
          BookingBranchLocation: JSON.parse(
            sessionStorage.getItem("BookingBranchLocation")
          ),
          BookingScreenName: String(
            sessionStorage.getItem("BookingScreenName")
          ),
          BookingSeat: String(sessionStorage.getItem("BookingSeat")),
          BookingDate: String(bookingDate),
          BookingFullDate: String(this.state.BookingFullDate),
          BookingAttributesNames: String(
            sessionStorage.getItem("BookingAttributesNames")
          ),
          BookingCinemaOperatorCode: String(
            sessionStorage.getItem("BookingCinemaOperatorCode")
          ),
          BookingTime: String(sessionStorage.getItem("BookingTime")),
          BookingPrice: String(sessionStorage.getItem("BookingPrice")),
          BookingPriceDisplay: String(
            sessionStorage.getItem("BookingPriceDisplay")
          ),
          BookingUserSessionId: String(
            sessionStorage.getItem("BookingUserSessionId")
          ),
          BookingUserPhoneNumber: String(
            sessionStorage.getItem("BookingUserPhoneNumber")
          ),
          BookingCurrentServerTime: String(
            sessionStorage.getItem("BookingCurrentServerTime")
          ),
          userInfo: JSON.parse(sessionStorage.getItem("userInfo"))
        },
        () => {
          let filterPattern = "Booking";
          let filtered = Object.keys(this.state).filter(str =>
            str.startsWith(filterPattern)
          );
          filtered.forEach(key => {
            this.state.dataToPayment.payload[key] = this.state[key];
          });
          this.state.dataToPayment.third_party_tx_id = this.state.BookingUserSessionId;
          this.state.dataToPayment.amount_satang = this.state.BookingPrice;
          this.state.dataToPayment.tmn_id = this.state.userInfo.accid;
          this.state.dataToPayment.mobile_no = this.state.userInfo.mobileno;
          this.setState({
            dataToTicket: this.state.dataToPayment.payload,
            isLoading: false
          });
        }
      );
    } catch (error) {
      error => this.setState({ error, isLoading: false });
    }
  }

  formatMonth(month) {
    var monthNames = [
      "",
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค."
    ];
    return monthNames[month];
  }

  render() {
    const { isLoading, error, dataToTicket, userInfo, success } = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <img src="../Home/static/loading.svg"className="loading" />;
    }
    return (
      <Layout title="Cashier Page">
        {(() => {
          if (userInfo) {
            return (
              <div className="globalContent isCashier">
                <GlobalHeader hideBtnBack={success}>
                  {success ? "ซื้อตั๋วสำเร็จ" : "ยืนยันที่นั่ง"}
                </GlobalHeader>
                <div className="globalBody">
                  <div className="globalBodyInner">
                    <Ticket
                      ref={this.refTicket}
                      dataTicket={dataToTicket}
                      accid={userInfo.accid}
                      submitPayment={this.submitPayment.bind(this)}
                    />
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <section className="empty">
                <img src="../Home/static/icon-film-empty.svg" />
                <h5>ข้อมูลไม่ถูกต้อง</h5>
              </section>
            );
          }
        })()}
      </Layout>
    );
  }
}

export default Cashier;
